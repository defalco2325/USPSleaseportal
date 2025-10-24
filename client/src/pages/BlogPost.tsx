import { useRoute, Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, ArrowLeft, ArrowRight } from "lucide-react";
import { getBlogPost, getAllBlogPosts } from "@/data/blogPosts";

export default function BlogPost() {
  const [, params] = useRoute("/blog/:slug");
  const post = params?.slug ? getBlogPost(params.slug) : undefined;
  const allPosts = getAllBlogPosts();
  const relatedPosts = post 
    ? allPosts.filter(p => p.category === post.category && p.slug !== post.slug).slice(0, 3)
    : [];

  if (!post) {
    return (
      <>
        <SEOHead title="Post Not Found" description="The blog post you're looking for could not be found." canonical="/blog" />
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">
                The blog post you're looking for doesn't exist.
              </p>
              <Link href="/blog">
                <Button>Back to Blog</Button>
              </Link>
            </div>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <SEOHead
        title={`${post.title} | Sell My Post Office Blog`}
        description={post.excerpt}
        canonical={`/blog/${post.slug}`}
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Back to Blog */}
          <section className="py-6 border-b">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Link href="/blog">
                <Button variant="ghost" size="sm" data-testid="button-back-blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Blog
                </Button>
              </Link>
            </div>
          </section>

          {/* Article Header */}
          <section className="py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="animate-fade-in">
                <div className="flex items-center gap-3 mb-6">
                  <Badge className="bg-primary text-primary-foreground">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                  {post.title}
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>
          </section>

          {/* Article Content */}
          <article className="py-16 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Introduction */}
              <div className="prose prose-lg max-w-none mb-12">
                <p className="text-lg text-foreground leading-relaxed">
                  {post.content.intro}
                </p>
              </div>

              {/* Content Sections */}
              {post.content.sections.map((section, index) => (
                <div key={index} className="mb-12">
                  <h2 className="text-3xl font-bold text-foreground mb-4">
                    {section.heading}
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    {section.content}
                  </p>
                </div>
              ))}

              {/* Conclusion */}
              <div className="prose prose-lg max-w-none mb-12 p-6 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-lg text-foreground leading-relaxed font-medium">
                  {post.content.conclusion}
                </p>
              </div>

              {/* CTA Section */}
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-foreground mb-4">
                    Ready to Sell Your USPS Property?
                  </h3>
                  <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
                    Get a free, no-obligation property valuation report. Discover what your post office building is worth and connect with nationwide buyers.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/valuation">
                      <Button size="lg" className="w-full sm:w-auto" data-testid="button-cta-valuation">
                        Get Free Valuation
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-cta-contact">
                        Contact Us
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="py-16 bg-muted/50">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h2 className="text-3xl font-bold text-foreground mb-8">Related Articles</h2>
                <div className="grid md:grid-cols-3 gap-8">
                  {relatedPosts.map((relatedPost, index) => (
                    <Link key={index} href={`/blog/${relatedPost.slug}`}>
                      <Card className="p-6 h-full hover-elevate group transition-all duration-300 cursor-pointer">
                        <Badge variant="outline" className="mb-3 text-xs">
                          {relatedPost.category}
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                          {relatedPost.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                          {relatedPost.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {relatedPost.date}
                        </div>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </>
  );
}
