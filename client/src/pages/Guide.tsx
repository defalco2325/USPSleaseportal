import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import FAQAccordion from "@/components/FAQAccordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const sections = [
  { id: "understanding-cap-rates", title: "Understanding Cap Rates" },
  { id: "lease-term-remaining", title: "Importance of Lease Term Remaining" },
  { id: "market-comparables", title: "Market Comparables & Pricing" },
  { id: "timeline", title: "Typical Transaction Timeline" },
  { id: "closing-costs", title: "Closing Costs & Fees" },
  { id: "faqs", title: "Frequently Asked Questions" },
];

export default function Guide() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const valuationUrl = import.meta.env.VITE_VALUATION_URL || "#";

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveSection(id);
    }
  };

  return (
    <>
      <SEOHead
        title="How to Sell Your Post Office: Complete Guide 2025"
        description="Complete guide to selling your USPS-leased post office property in 2025. Learn about cap rates, lease terms, market comparables, timelines, and closing costs."
        canonical="/guide"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                How to Sell Your Post Office: Complete Guide 2025
              </h1>
              <p className="text-xl text-muted-foreground mb-12 leading-relaxed">
                Everything you need to know about selling your USPS-leased property for maximum value.
              </p>

              {/* Table of Contents */}
              <Card className="p-8 mb-12">
                <h2 className="text-2xl font-semibold text-foreground mb-6">Table of Contents</h2>
                <nav className="space-y-3">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`block text-left w-full px-4 py-2 rounded-md transition-colors hover-elevate ${
                        activeSection === section.id
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-foreground hover:bg-muted"
                      }`}
                      data-testid={`toc-${section.id}`}
                    >
                      {section.title}
                    </button>
                  ))}
                </nav>
              </Card>

              {/* Content Sections */}
              <div className="space-y-16">
                <section id="understanding-cap-rates">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Understanding Cap Rates</h2>
                  <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
                    <p>
                      The capitalization rate (cap rate) is the most critical metric in valuing USPS-leased properties. 
                      It represents the expected annual return on investment and is calculated by dividing the annual net 
                      operating income by the property's purchase price.
                    </p>
                    <p>
                      For USPS-leased properties, cap rates typically range from 5.5% to 7.5%, depending on factors like 
                      location, remaining lease term, property condition, and local market conditions. Properties in 
                      high-growth areas with long lease terms command lower cap rates (higher prices).
                    </p>
                    <h3 className="text-xl font-semibold text-foreground mt-6">What Affects Your Cap Rate?</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Remaining lease term (longer is better)</li>
                      <li>Property location and local market strength</li>
                      <li>USPS lease renewal history in the area</li>
                      <li>Property condition and maintenance requirements</li>
                      <li>Current interest rate environment</li>
                    </ul>
                  </div>
                </section>

                <section id="lease-term-remaining">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Importance of Lease Term Remaining</h2>
                  <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
                    <p>
                      The remaining term on your USPS lease is one of the strongest value drivers. Properties with 10+ 
                      years remaining typically command premium prices, as they offer buyers guaranteed income with 
                      minimal uncertainty.
                    </p>
                    <p>
                      Even properties with shorter lease terms can be valuable. The USPS has a strong track record of 
                      renewing leases, especially in locations where they've established operations. Our buyers 
                      understand these renewal patterns and factor them into their offers.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground mt-6">Lease Term Guidelines</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>15+ years:</strong> Premium pricing, highest buyer demand</li>
                      <li><strong>10-15 years:</strong> Strong pricing, broad buyer interest</li>
                      <li><strong>5-10 years:</strong> Moderate pricing, selective buyers</li>
                      <li><strong>Under 5 years:</strong> Value based on renewal probability</li>
                    </ul>
                  </div>
                </section>

                {/* Inline CTA 1 */}
                <Card className="p-8 bg-primary/5 border-primary/20">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Want to Know Your Property's Exact Value?
                    </h3>
                    <p className="text-muted-foreground">
                      Get a free, confidential valuation based on your specific lease terms and location.
                    </p>
                    <Button size="lg" asChild data-testid="button-inline-cta-1">
                      <a href={valuationUrl} target="_blank" rel="noopener noreferrer">
                        Get My Free Valuation
                      </a>
                    </Button>
                  </div>
                </Card>

                <section id="market-comparables">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Market Comparables & Pricing</h2>
                  <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
                    <p>
                      Understanding recent comparable sales in your market is essential for realistic pricing expectations. 
                      USPS-leased properties are unique, and traditional residential or commercial comps may not apply.
                    </p>
                    <p>
                      We maintain a comprehensive database of USPS property sales across the country, allowing us to 
                      provide accurate valuations based on truly comparable transactions. This data includes lease terms, 
                      cap rates, property sizes, and locations similar to yours.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground mt-6">Key Pricing Factors</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Annual rental income (higher rent = higher value)</li>
                      <li>Property size and building condition</li>
                      <li>Local population density and economic growth</li>
                      <li>Competition from nearby post offices</li>
                      <li>Parking availability and accessibility</li>
                    </ul>
                  </div>
                </section>

                <section id="timeline">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Typical Transaction Timeline</h2>
                  <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
                    <p>
                      One of the advantages of selling a USPS-leased property is the streamlined transaction process. 
                      With our network of qualified buyers and standardized procedures, you can expect a faster sale 
                      compared to traditional commercial real estate.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground mt-6">Typical Timeline Breakdown</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Days 1-2:</strong> Submit property information and receive initial valuation</li>
                      <li><strong>Days 3-7:</strong> Review and accept cash offer from qualified buyer</li>
                      <li><strong>Days 8-21:</strong> Due diligence period (title review, lease verification)</li>
                      <li><strong>Days 22-45:</strong> Finalize documentation and close transaction</li>
                    </ul>
                    <p className="mt-4">
                      Motivated sellers can often close faster, sometimes in as few as 30 days, depending on their 
                      situation and the buyer's readiness.
                    </p>
                  </div>
                </section>

                {/* Inline CTA 2 */}
                <Card className="p-8 bg-primary/5 border-primary/20">
                  <div className="text-center space-y-4">
                    <h3 className="text-2xl font-semibold text-foreground">
                      Ready to Start the Process?
                    </h3>
                    <p className="text-muted-foreground">
                      Connect with our team and get your valuation within 48 hours.
                    </p>
                    <Button size="lg" asChild data-testid="button-inline-cta-2">
                      <a href={valuationUrl} target="_blank" rel="noopener noreferrer">
                        Request Your Valuation
                      </a>
                    </Button>
                  </div>
                </Card>

                <section id="closing-costs">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Closing Costs & Fees</h2>
                  <div className="prose prose-lg max-w-none space-y-4 text-muted-foreground">
                    <p>
                      Unlike traditional real estate sales, selling your USPS-leased property through our network means 
                      you pay zero broker commissions. This can save you 5-6% of the sale price compared to using a 
                      conventional broker.
                    </p>
                    <h3 className="text-xl font-semibold text-foreground mt-6">Typical Seller Costs</h3>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Title insurance:</strong> Usually split with buyer or paid by buyer</li>
                      <li><strong>Legal fees:</strong> $500-$1,500 for attorney review (optional but recommended)</li>
                      <li><strong>Transfer taxes:</strong> Varies by state and locality</li>
                      <li><strong>Pro-rated property taxes:</strong> Based on closing date</li>
                      <li><strong>Broker commissions:</strong> $0 (we don't charge commissions)</li>
                    </ul>
                    <p className="mt-4">
                      Total closing costs typically range from 1-2% of the sale price, compared to 6-8% with traditional 
                      brokers. This means you keep significantly more of your sale proceeds.
                    </p>
                  </div>
                </section>

                <section id="faqs">
                  <h2 className="text-3xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
                  <FAQAccordion />
                </section>
              </div>

              {/* Final CTA */}
              <Card className="p-12 bg-primary text-primary-foreground mt-16">
                <div className="text-center space-y-6">
                  <h2 className="text-3xl font-bold">
                    Get Your Free Property Valuation Today
                  </h2>
                  <p className="text-lg text-primary-foreground/90 max-w-2xl mx-auto">
                    Now that you understand the process, take the first step toward maximizing your property's value.
                  </p>
                  <Button
                    size="lg"
                    variant="secondary"
                    className="text-lg h-14 px-8 bg-white text-foreground hover:bg-white/90"
                    asChild
                    data-testid="button-final-cta"
                  >
                    <a href={valuationUrl} target="_blank" rel="noopener noreferrer">
                      Request Free Valuation Report
                    </a>
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
