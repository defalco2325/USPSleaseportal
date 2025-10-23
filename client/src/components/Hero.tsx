import { Button } from "@/components/ui/button";
import heroImage from "@assets/USPS_1761190745850.webp";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const valuationUrl = import.meta.env.VITE_VALUATION_URL || "#";

  return (
    <section className="relative bg-background py-20 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Sell Your USPS-Leased Post Office for{" "}
              <span className="text-primary">Top Dollar</span> — Without Paying Broker Fees
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Get a confidential valuation and a strong cash offer from the largest post office buyers. 
              No commissions. No hassle. Close in as few as 45 days.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="text-lg h-14 px-8 group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-105"
                asChild
                data-testid="button-get-valuation"
              >
                <a href={valuationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  Get a Free Property Valuation Report
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </a>
              </Button>
            </div>
          </div>
          <div className="relative animate-fade-in-right">
            <div className="rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl">
              <img
                src={heroImage}
                alt="USPS Post Office Building"
                className="w-full h-auto object-cover"
                data-testid="img-hero"
              />
            </div>
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </section>
  );
}
