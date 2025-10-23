import { Shield, Users, Clock, DollarSign, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const benefits = [
  {
    icon: Shield,
    title: "USPS Specialists",
    description: "Our team has deep expertise in USPS lease valuations and post office property transactions.",
  },
  {
    icon: Users,
    title: "Nationwide Buyers",
    description: "Access to the largest network of qualified post office property buyers across the country.",
  },
  {
    icon: Clock,
    title: "Close in ~45 Days",
    description: "Streamlined process designed to close quickly, typically within 45 days of accepting an offer.",
  },
  {
    icon: DollarSign,
    title: "No Commissions",
    description: "Zero broker fees or commissions. You keep 100% of the sale price in your pocket.",
  },
  {
    icon: Lock,
    title: "Confidential Process",
    description: "Your information is protected. All valuations and negotiations remain completely confidential.",
  },
];

export default function ValuePropsGrid() {
  const valuationUrl = import.meta.env.VITE_VALUATION_URL || "#";

  return (
    <section className="py-20 bg-background" id="why-sell">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Why Sell With Us?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We provide unmatched expertise and value for USPS-leased property owners
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {benefits.map((benefit, index) => (
            <Card
              key={index}
              className="p-8 hover-elevate border-primary/20"
              data-testid={`card-benefit-${index}`}
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button
            size="lg"
            className="text-lg h-14 px-8"
            asChild
            data-testid="button-start-process"
          >
            <a href={valuationUrl} target="_blank" rel="noopener noreferrer">
              Start the Process
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
