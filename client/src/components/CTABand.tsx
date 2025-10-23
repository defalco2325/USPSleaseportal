import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function CTABand() {
  const valuationUrl = import.meta.env.VITE_VALUATION_URL || "#";

  return (
    <section className="py-16 bg-gradient-to-r from-primary via-primary to-primary/90 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6 animate-fade-in">
          Not Ready to Sell Yet? Find Out What Your Post Office Is Worth!
        </h2>
        <div className="animate-fade-in-up" style={{ animationDelay: "150ms" }}>
          <Button
            size="lg"
            variant="secondary"
            className="text-lg h-14 px-8 bg-white text-foreground hover:bg-white/90 group transition-all duration-300 hover:shadow-xl hover:scale-105"
            asChild
            data-testid="button-cta-valuation"
          >
            <a href={valuationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Get My Free Valuation Report
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
