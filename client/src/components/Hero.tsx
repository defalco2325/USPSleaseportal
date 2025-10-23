import { Button } from "@/components/ui/button";
import heroImage from "@assets/generated_images/Postal_themed_hero_illustration_36b21af8.png";

export default function Hero() {
  const valuationUrl = import.meta.env.VITE_VALUATION_URL || "#";

  return (
    <section className="relative bg-background py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight tracking-tight">
              Sell Your USPS-Leased Post Office for Top Dollar — Without Paying Broker Fees
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
              Get a confidential valuation and a strong cash offer from the largest post office buyers. 
              No commissions. No hassle. Close in as few as 45 days.
            </p>
            <div className="pt-4">
              <Button
                size="lg"
                className="text-lg h-14 px-8"
                asChild
                data-testid="button-get-valuation"
              >
                <a href={valuationUrl} target="_blank" rel="noopener noreferrer">
                  Get a Free Property Valuation Report
                </a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-xl">
              <img
                src={heroImage}
                alt="Post Office Illustration"
                className="w-full h-auto"
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
