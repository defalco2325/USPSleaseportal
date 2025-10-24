import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getAllBlogPosts } from "@/data/blogPosts";

const blogPosts = getAllBlogPosts().map(post => ({
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  category: post.category,
  date: post.date,
  readTime: post.readTime,
  featured: post.featured,
}));

const categories = ["All", "Leases & Contracts", "Valuation", "Sales Tips", "Tax & Legal", "Market Trends"];

export default function Blog() {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredFeaturedPosts = selectedCategory === "All" 
    ? blogPosts.filter(post => post.featured)
    : blogPosts.filter(post => post.featured && post.category === selectedCategory);

  const filteredRecentPosts = selectedCategory === "All"
    ? blogPosts.filter(post => !post.featured)
    : blogPosts.filter(post => !post.featured && post.category === selectedCategory);

  return (
    <>
      <SEOHead
        title="USPS Property Sales Blog | Expert Insights & Tips"
        description="Expert articles about selling USPS-leased properties, understanding lease agreements, property valuations, and maximizing sale value."
        canonical="/blog"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-primary/5 via-background to-accent/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="animate-fade-in">
                <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                  Expert Insights
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  USPS Property Sales Blog
                </h1>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                  Expert insights, market trends, and actionable tips for USPS-leased property owners
                </p>
              </div>
            </div>
          </section>

          {/* Category Filter */}
          <section className="py-8 bg-background border-b border-border sticky top-16 z-40 backdrop-blur-md bg-background/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category, index) => (
                  <Button
                    key={index}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="transition-all duration-300 hover:scale-105"
                    data-testid={`button-category-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          {/* Featured Posts */}
          <section className="py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-foreground mb-8 animate-fade-in">Featured Articles</h2>
              {filteredFeaturedPosts.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8 mb-16">
                  {filteredFeaturedPosts.map((post, index) => (
                  <Card
                    key={index}
                    className="p-8 hover-elevate group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 animate-fade-in-up"
                    style={{ animationDelay: `${index * 150}ms` }}
                    data-testid={`card-featured-${index}`}
                  >
                    <div className="flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <Badge className="bg-primary text-primary-foreground" data-testid={`badge-featured-category-${index}`}>
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
                      <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors" data-testid={`text-featured-title-${index}`}>
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground leading-relaxed mb-6 flex-1" data-testid={`text-featured-excerpt-${index}`}>
                        {post.excerpt}
                      </p>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" className="w-fit group/btn" data-testid={`button-read-featured-${index}`}>
                          Read More
                          <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 mb-16">
                  <p className="text-muted-foreground text-lg">No featured articles in this category yet.</p>
                </div>
              )}

              {/* All Posts */}
              <h2 className="text-3xl font-bold text-foreground mb-8 animate-fade-in">Recent Articles</h2>
              {filteredRecentPosts.length > 0 ? (
                <div className="grid md:grid-cols-3 gap-8">
                  {filteredRecentPosts.map((post, index) => (
                  <Link key={index} href={`/blog/${post.slug}`}>
                    <Card
                      className="p-6 hover-elevate group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 animate-fade-in-up cursor-pointer"
                      style={{ animationDelay: `${index * 100}ms` }}
                      data-testid={`card-post-${index}`}
                    >
                      <div className="flex flex-col h-full">
                        <Badge variant="outline" className="w-fit mb-3 text-xs" data-testid={`badge-category-${index}`}>
                          {post.category}
                        </Badge>
                        <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors" data-testid={`text-post-title-${index}`}>
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1" data-testid={`text-post-excerpt-${index}`}>
                          {post.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-border">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />
                            {post.date}
                          </div>
                          <span className="text-xs text-primary flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read More
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">No recent articles in this category yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Newsletter CTA */}
          <section className="py-16 bg-gradient-to-r from-primary via-primary to-primary/90">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4 animate-fade-in">
                Stay Informed on USPS Property Market Trends
              </h2>
              <p className="text-lg text-primary-foreground/90 mb-8 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
                Get expert insights, market updates, and exclusive tips delivered to your inbox
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-xl mx-auto animate-fade-in-up" style={{ animationDelay: "300ms" }}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg border-2 border-white/20 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/60 focus:outline-none focus:border-white/40 transition-colors"
                  data-testid="input-newsletter-email"
                />
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-foreground hover:bg-white/90"
                  data-testid="button-subscribe"
                >
                  Subscribe
                </Button>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
