import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import Guide from "@/pages/Guide";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Valuation from "@/pages/Valuation";
import AdminLogin from "@/pages/admin/Login";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminValuations from "@/pages/admin/Valuations";
import AdminLeads from "@/pages/admin/Leads";
import AdminBlogPosts from "@/pages/admin/BlogPosts";
import BlogPostForm from "@/pages/admin/BlogPostForm";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/guide" component={Guide} />
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:slug" component={BlogPost} />
      <Route path="/valuation" component={Valuation} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={AdminDashboard} />
      <Route path="/admin/valuations" component={AdminValuations} />
      <Route path="/admin/leads" component={AdminLeads} />
      <Route path="/admin/blog" component={AdminBlogPosts} />
      <Route path="/admin/blog/new" component={BlogPostForm} />
      <Route path="/admin/blog/edit/:id" component={BlogPostForm} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
