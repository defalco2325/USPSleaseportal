import { FileText, TrendingUp, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

const steps = [
  {
    icon: FileText,
    title: "Request Valuation",
    description: "Submit your property details and receive a confidential, expert valuation report within 24-48 hours.",
  },
  {
    icon: TrendingUp,
    title: "Review Offer",
    description: "Get a no-obligation cash offer from qualified buyers. Review terms at your pace with complete transparency.",
  },
  {
    icon: Clock,
    title: "Close Fast",
    description: "Close in as few as 45 days with no broker fees or commissions. We handle the complexity for you.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30" id="how-it-works">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three simple steps to sell your USPS-leased property with confidence
          </p>
        </div>

        {/* Desktop: Horizontal Stepper */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 relative">
          {/* Connecting Lines */}
          <div className="absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 hidden md:block" style={{ left: '20%', right: '20%' }} />
          
          {steps.map((step, index) => (
            <Card
              key={index}
              className="relative p-8 text-center hover-elevate group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
              data-testid={`card-step-${index + 1}`}
            >
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground relative z-10 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                  <step.icon className="w-8 h-8" />
                </div>
                <div className="absolute top-6 right-6 text-6xl font-bold text-primary/5 group-hover:text-primary/10 transition-colors">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-foreground">{step.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Mobile: Vertical Stack */}
        <div className="md:hidden space-y-6">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="p-6 hover-elevate transition-all duration-300 hover:shadow-lg animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
              data-testid={`card-step-mobile-${index + 1}`}
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground flex-shrink-0 transition-transform duration-300 hover:scale-110">
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
