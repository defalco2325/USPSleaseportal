import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, DollarSign, Calendar } from "lucide-react";

const casestudies = [
  {
    location: "San Diego, CA",
    salePrice: "$2.4M",
    closeTime: "38 days",
    highlight: "15% above asking price",
    description: "Prime location post office with 12-year lease remaining. Buyer competition drove final price above initial valuation.",
  },
  {
    location: "Austin, TX",
    salePrice: "$1.8M",
    closeTime: "42 days",
    highlight: "All-cash offer",
    description: "Single-tenant facility with strong USPS lease terms. Seamless transaction with institutional buyer.",
  },
  {
    location: "Orlando, FL",
    salePrice: "$3.1M",
    closeTime: "47 days",
    highlight: "Multiple offers received",
    description: "High-traffic location with recently renewed 20-year lease. Owner selected best terms from 3 qualified buyers.",
  },
];

export default function RecentSales() {
  return (
    <section className="py-20 bg-muted/30" id="case-studies">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Recent Success Stories
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real transactions from property owners who trusted us with their USPS-leased buildings
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {casestudies.map((sale, index) => (
            <Card
              key={index}
              className="p-8 hover-elevate group transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border-2 border-transparent hover:border-primary/20 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
              data-testid={`card-case-study-${index}`}
            >
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2 text-foreground">
                    <MapPin className="w-5 h-5 text-primary" />
                    <h3 className="font-bold text-xl">{sale.location}</h3>
                  </div>
                  <Badge className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
                    {sale.highlight}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Sale Price</p>
                      <p className="text-2xl font-bold text-foreground">{sale.salePrice}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Time to Close</p>
                      <p className="text-lg font-semibold text-foreground">{sale.closeTime}</p>
                    </div>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed pt-4 border-t border-border">
                  {sale.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
