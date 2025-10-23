import { Shield, Users, Clock, DollarSign, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

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
        <div className="text-center mb-16 animate-fade-in">
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
              className="p-8 hover-elevate group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
              data-testid={`card-benefit-${index}`}
            >
              <div className="flex flex-col items-start space-y-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/10 to-primary/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <benefit.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{benefit.description}</p>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center animate-fade-in-up" style={{ animationDelay: "600ms" }}>
          <Button
            size="lg"
            className="text-lg h-14 px-8 group transition-all duration-300 hover:shadow-xl hover:scale-105"
            asChild
            data-testid="button-start-process"
          >
            <a href={valuationUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
              Start the Process
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
