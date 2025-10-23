import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Shield, Users, TrendingUp, Award } from "lucide-react";
import postOfficeImage from "@assets/stock_images/usps_united_states_p_1bb053d7.jpg";

const values = [
  {
    icon: Shield,
    title: "Trust & Transparency",
    description: "We believe in complete transparency throughout the selling process. No hidden fees, no surprises.",
  },
  {
    icon: Users,
    title: "Client-First Approach",
    description: "Your goals are our priority. We work tirelessly to maximize value and ensure a smooth transaction.",
  },
  {
    icon: TrendingUp,
    title: "Market Expertise",
    description: "Years of specialized experience in USPS-leased properties gives you a competitive advantage.",
  },
  {
    icon: Award,
    title: "Proven Results",
    description: "Hundreds of successful transactions and satisfied property owners speak to our track record.",
  },
];

export default function About() {
  const valuationUrl = import.meta.env.VITE_VALUATION_URL || "#";

  return (
    <>
      <SEOHead
        title="About Us - USPS Property Sale Specialists"
        description="Learn about our mission to help USPS-leased property owners maximize value through expert guidance and nationwide buyer access. No commissions, complete transparency."
        canonical="/about"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          {/* Hero Section */}
          <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Helping Property Owners Maximize Value
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  We specialize in connecting USPS-leased property owners with the nation's most qualified buyers, 
                  ensuring you get top dollar without paying broker fees.
                </p>
              </div>
            </div>
          </section>

          {/* Mission Section */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                    Our Mission
                  </h2>
                  <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                    <p>
                      We founded this service after seeing too many property owners leave money on the table or 
                      pay excessive broker fees when selling their USPS-leased assets.
                    </p>
                    <p>
                      Our mission is simple: provide property owners with expert valuations, access to serious 
                      buyers, and a transparent process that maximizes value while minimizing costs and complexity.
                    </p>
                    <p>
                      By leveraging our deep market knowledge and nationwide buyer network, we've helped hundreds 
                      of property owners achieve exceptional outcomes.
                    </p>
                  </div>
                </div>
                <div>
                  <div className="rounded-2xl overflow-hidden shadow-xl mb-8">
                    <img
                      src={postOfficeImage}
                      alt="USPS Post Office"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <Card className="p-8 bg-primary/5 border-primary/20">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-4xl font-bold text-primary mb-2">500+</h3>
                        <p className="text-muted-foreground">Properties Sold</p>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-primary mb-2">$250M+</h3>
                        <p className="text-muted-foreground">Total Transaction Value</p>
                      </div>
                      <div>
                        <h3 className="text-4xl font-bold text-primary mb-2">0%</h3>
                        <p className="text-muted-foreground">Broker Commissions Charged</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </section>

          {/* Values Section */}
          <section className="py-20 bg-muted/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Our Values
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  The principles that guide everything we do
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                {values.map((value, index) => (
                  <Card key={index} className="p-8 hover-elevate" data-testid={`card-value-${index}`}>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <value.icon className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          {/* Process Recap */}
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
                  How We Work With You
                </h2>
                <Card className="p-8">
                  <ol className="space-y-6">
                    <li className="flex items-start space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        1
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Confidential Valuation</h3>
                        <p className="text-muted-foreground">
                          Submit your property details and receive a comprehensive, expert valuation within 24-48 hours.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        2
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Connect With Buyers</h3>
                        <p className="text-muted-foreground">
                          We present your property to our network of pre-qualified buyers who specialize in USPS leases.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        3
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Review Offers</h3>
                        <p className="text-muted-foreground">
                          Receive competitive cash offers with transparent terms. No pressure, no obligation.
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start space-x-4">
                      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                        4
                      </span>
                      <div>
                        <h3 className="font-semibold text-foreground mb-1">Smooth Closing</h3>
                        <p className="text-muted-foreground">
                          We guide you through every step of the closing process, typically completed within 45 days.
                        </p>
                      </div>
                    </li>
                  </ol>
                </Card>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-primary">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-6">
                Ready to Learn What Your Property Is Worth?
              </h2>
              <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
                Get your free, confidential valuation and discover how we can help you maximize value.
              </p>
              <Button
                size="lg"
                variant="secondary"
                className="text-lg h-14 px-8 bg-white text-foreground hover:bg-white/90"
                asChild
                data-testid="button-about-cta"
              >
                <a href={valuationUrl} target="_blank" rel="noopener noreferrer">
                  Get My Free Valuation Report
                </a>
              </Button>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
