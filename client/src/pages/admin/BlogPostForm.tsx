import { useState, useEffect } from "react";
import { useRoute, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const categories = [
  "Leases & Contracts",
  "Valuation",
  "Sales Tips",
  "Tax & Legal",
  "Market Trends",
];

const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug is too long")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  excerpt: z.string().min(1, "Excerpt is required").max(300, "Excerpt is too long"),
  category: z.string().min(1, "Category is required"),
  date: z.string().optional(),
  readTime: z.string().optional(),
  featured: z.boolean(),
  content: z.object({
    intro: z.string().min(1, "Introduction is required"),
    sections: z.array(
      z.object({
        heading: z.string().min(1, "Section heading is required"),
        content: z.string().min(1, "Section content is required"),
      })
    ),
    conclusion: z.string().min(1, "Conclusion is required"),
  }),
});

type BlogPostFormData = z.infer<typeof blogPostSchema>;

export default function BlogPostForm() {
  const [, params] = useRoute("/admin/blog/edit/:id");
  const [, setLocation] = useLocation();
  const isEditing = !!params?.id;
  const { toast } = useToast();

  const { data: existingPost, isLoading } = useQuery({
    queryKey: ["/api/blog-posts", params?.id],
    queryFn: async () => {
      if (!params?.id) return null;
      const response = await fetch(`/api/blog-posts?id=${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch post");
      return response.json();
    },
    enabled: isEditing,
  });

  const form = useForm<BlogPostFormData>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      category: categories[0],
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      readTime: "5 min read",
      featured: false,
      content: {
        intro: "",
        sections: [{ heading: "", content: "" }],
        conclusion: "",
      },
    },
  });

  useEffect(() => {
    if (existingPost) {
      form.reset(existingPost);
    }
  }, [existingPost, form]);

  const saveMutation = useMutation({
    mutationFn: async (data: BlogPostFormData) => {
      const url = isEditing
        ? "/api/blog-posts"
        : "/api/blog-posts";
      
      const body = isEditing
        ? { ...data, id: params?.id }
        : data;

      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save post");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog-posts"] });
      toast({
        title: "Success",
        description: isEditing ? "Blog post updated" : "Blog post created",
      });
      setLocation("/admin/blog");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogPostFormData) => {
    saveMutation.mutate(data);
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    if (!isEditing || !form.getValues("slug")) {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      form.setValue("slug", slug);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="text-center text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => setLocation("/admin/blog")}
          data-testid="button-back"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blog Posts
        </Button>
      </div>

      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          {isEditing ? "Edit Blog Post" : "Create Blog Post"}
        </h1>
        <p className="text-muted-foreground mb-8">
          {isEditing
            ? "Update your blog post content and settings"
            : "Add a new blog post to your website"}
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            handleTitleChange(e.target.value);
                          }}
                          placeholder="Enter post title"
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL Slug</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="post-url-slug"
                          data-testid="input-slug"
                        />
                      </FormControl>
                      <FormDescription>
                        Used in the URL: /blog/your-slug-here
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="excerpt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Excerpt</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Brief summary of the post"
                          rows={3}
                          data-testid="input-excerpt"
                        />
                      </FormControl>
                      <FormDescription>
                        Short description shown in blog listings
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat} value={cat}>
                                {cat}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="readTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Read Time</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="5 min read"
                            data-testid="input-read-time"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          data-testid="checkbox-featured"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Featured Post</FormLabel>
                        <FormDescription>
                          Featured posts appear at the top of the blog
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Content</h2>

              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="content.intro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Introduction</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Opening paragraph of your post"
                          rows={4}
                          data-testid="input-intro"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <FormLabel>Content Sections</FormLabel>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const sections = form.getValues("content.sections");
                        form.setValue("content.sections", [
                          ...sections,
                          { heading: "", content: "" },
                        ]);
                      }}
                      data-testid="button-add-section"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Section
                    </Button>
                  </div>

                  {form.watch("content.sections").map((_, index) => (
                    <Card key={index} className="p-4 mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-medium">Section {index + 1}</h3>
                        {form.watch("content.sections").length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const sections = form.getValues("content.sections");
                              sections.splice(index, 1);
                              form.setValue("content.sections", sections);
                            }}
                            data-testid={`button-remove-section-${index}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <FormField
                          control={form.control}
                          name={`content.sections.${index}.heading`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  {...field}
                                  placeholder="Section heading"
                                  data-testid={`input-section-heading-${index}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`content.sections.${index}.content`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  placeholder="Section content"
                                  rows={4}
                                  data-testid={`input-section-content-${index}`}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </Card>
                  ))}
                </div>

                <FormField
                  control={form.control}
                  name="content.conclusion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Conclusion</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Closing paragraph of your post"
                          rows={4}
                          data-testid="input-conclusion"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Card>

            <div className="flex gap-4">
              <Button
                type="submit"
                disabled={saveMutation.isPending}
                data-testid="button-save"
              >
                {saveMutation.isPending
                  ? "Saving..."
                  : isEditing
                  ? "Update Post"
                  : "Create Post"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setLocation("/admin/blog")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
