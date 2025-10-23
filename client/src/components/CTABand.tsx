import { Button } from "@/components/ui/button";

export default function CTABand() {
  const valuationUrl = import.meta.env.VITE_VALUATION_URL || "#";

  return (
    <section className="py-16 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
          Not Ready to Sell Yet? Find Out What Your Post Office Is Worth!
        </h2>
        <Button
          size="lg"
          variant="secondary"
          className="text-lg h-14 px-8 bg-white text-foreground hover:bg-white/90"
          asChild
          data-testid="button-cta-valuation"
        >
          <a href={valuationUrl} target="_blank" rel="noopener noreferrer">
            Get My Free Valuation Report
          </a>
        </Button>
      </div>
    </section>
  );
}
