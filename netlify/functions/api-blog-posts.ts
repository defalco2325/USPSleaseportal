import type { Context } from "@netlify/functions";
import { getStore } from "@netlify/blobs";
import { parseCookies, verifyToken } from "./_auth";

async function verifyAuth(req: Request): Promise<{ authenticated: boolean }> {
  const cookieHeader = req.headers.get("cookie");
  const cookies = parseCookies(cookieHeader || "");
  const token = cookies["admin_token"];
  
  if (!token) {
    return { authenticated: false };
  }
  
  const payload = verifyToken(token);
  if (!payload || payload.role !== "admin") {
    return { authenticated: false };
  }
  
  return { authenticated: true };
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  featured: boolean;
  content: {
    intro: string;
    sections: {
      heading: string;
      content: string;
    }[];
    conclusion: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default async (req: Request, context: Context) => {
  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers });
  }

  const url = new URL(req.url);
  const method = req.method;

  try {
    // GET /api/blog-posts - List all blog posts (public)
    if (method === "GET" && !url.searchParams.get("id")) {
      const store = getStore("blog-posts");
      let index: string[] = [];
      
      try {
        const indexData = await store.get("posts:index", { type: "json" });
        index = (indexData as string[]) || [];
      } catch (e) {
        // Index doesn't exist yet
      }

      const posts: BlogPost[] = [];
      for (const id of index) {
        try {
          const post = await store.get(`post:${id}`, { type: "json" }) as BlogPost;
          if (post) posts.push(post);
        } catch (e) {
          console.error(`Error fetching post ${id}:`, e);
        }
      }

      // Sort by date descending
      posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

      return new Response(JSON.stringify(posts), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // GET /api/blog-posts?id=xxx - Get single blog post by ID (public)
    if (method === "GET" && url.searchParams.get("id")) {
      const id = url.searchParams.get("id")!;
      const store = getStore("blog-posts");
      
      const post = await store.get(`post:${id}`, { type: "json" }) as BlogPost;
      
      if (!post) {
        return new Response(JSON.stringify({ error: "Blog post not found" }), {
          status: 404,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify(post), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // All other methods require authentication
    const authResult = await verifyAuth(req);
    if (!authResult.authenticated) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // POST /api/blog-posts - Create new blog post (admin only)
    if (method === "POST") {
      const body = await req.json() as Partial<BlogPost>;
      
      // Validate required fields
      if (!body.title || !body.slug || !body.excerpt || !body.category) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      const store = getStore("blog-posts");
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const now = new Date().toISOString();

      const newPost: BlogPost = {
        id,
        slug: body.slug,
        title: body.title,
        excerpt: body.excerpt,
        category: body.category,
        date: body.date || new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric"
        }),
        readTime: body.readTime || "5 min read",
        featured: body.featured || false,
        content: body.content || {
          intro: "",
          sections: [],
          conclusion: ""
        },
        createdAt: now,
        updatedAt: now,
      };

      // Save post
      await store.setJSON(`post:${id}`, newPost);

      // Update index
      let index: string[] = [];
      try {
        const indexData = await store.get("posts:index", { type: "json" });
        index = (indexData as string[]) || [];
      } catch (e) {
        // Index doesn't exist yet
      }
      
      index.push(id);
      await store.setJSON("posts:index", index);

      return new Response(JSON.stringify(newPost), {
        status: 201,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // PUT /api/blog-posts - Update blog post (admin only)
    if (method === "PUT") {
      const body = await req.json() as Partial<BlogPost> & { id: string };
      
      if (!body.id) {
        return new Response(JSON.stringify({ error: "Missing post ID" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      const store = getStore("blog-posts");
      const existingPost = await store.get(`post:${body.id}`, { type: "json" }) as BlogPost;

      if (!existingPost) {
        return new Response(JSON.stringify({ error: "Blog post not found" }), {
          status: 404,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      const updatedPost: BlogPost = {
        ...existingPost,
        ...body,
        id: existingPost.id, // Prevent ID change
        createdAt: existingPost.createdAt, // Preserve creation date
        updatedAt: new Date().toISOString(),
      };

      await store.setJSON(`post:${body.id}`, updatedPost);

      return new Response(JSON.stringify(updatedPost), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    // DELETE /api/blog-posts?id=xxx - Delete blog post (admin only)
    if (method === "DELETE") {
      const id = url.searchParams.get("id");
      
      if (!id) {
        return new Response(JSON.stringify({ error: "Missing post ID" }), {
          status: 400,
          headers: { ...headers, "Content-Type": "application/json" },
        });
      }

      const store = getStore("blog-posts");
      
      // Remove from storage
      await store.delete(`post:${id}`);

      // Update index
      let index: string[] = [];
      try {
        const indexData = await store.get("posts:index", { type: "json" });
        index = (indexData as string[]) || [];
      } catch (e) {
        // Index doesn't exist yet
      }

      index = index.filter(postId => postId !== id);
      await store.setJSON("posts:index", index);

      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...headers, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...headers, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Blog posts API error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...headers, "Content-Type": "application/json" },
    });
  }
};
