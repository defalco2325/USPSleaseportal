import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ValuationForm from "@/components/ValuationForm";

export default function Valuation() {
  return (
    <>
      <SEOHead
        title="Free USPS Property Valuation Calculator | Get Your Estimate"
        description="Calculate your USPS-leased property value instantly with our free valuation calculator. Get low and high estimates based on annual rent, taxes, insurance, and square footage."
        canonical="/valuation"
      />
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <Header />
        <main className="flex-1 py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 animate-fade-in">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                Free Property Valuation
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Get an instant estimate of your USPS-leased property value. No obligations, zero broker fees.
              </p>
            </div>

            <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
              <ValuationForm />
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 grid md:grid-cols-3 gap-8 text-center animate-fade-in-up" style={{ animationDelay: "400ms" }}>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">100%</p>
                <p className="text-sm text-muted-foreground">No broker fees or commissions</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">24-48hrs</p>
                <p className="text-sm text-muted-foreground">Expert review turnaround time</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-primary mb-2">Multiple</p>
                <p className="text-sm text-muted-foreground">Post offices under our ownership</p>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
