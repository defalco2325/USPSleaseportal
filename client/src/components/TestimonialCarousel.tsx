import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";

//todo: remove mock functionality
const testimonials = [
  {
    quote: "The valuation was spot-on and the entire process was incredibly smooth. Closed in 42 days with no hassles. Highly recommended!",
    initials: "J.M.",
    state: "California",
  },
  {
    quote: "I was skeptical at first, but the team delivered exactly what they promised. No broker fees saved me thousands, and the buyers were professional.",
    initials: "R.T.",
    state: "Texas",
  },
  {
    quote: "After owning my USPS-leased property for 15 years, I wanted a fair deal. The offer exceeded my expectations and the process was transparent throughout.",
    initials: "S.K.",
    state: "Florida",
  },
  {
    quote: "Exceptional service from start to finish. The confidential valuation gave me the confidence to move forward, and closing was seamless.",
    initials: "M.W.",
    state: "New York",
  },
];

export default function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            What Property Owners Say
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real experiences from sellers who've worked with us
          </p>
        </div>

        <div
          className="relative max-w-4xl mx-auto"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Card className="p-12 relative" data-testid="card-testimonial">
            <Quote className="w-12 h-12 text-primary/20 absolute top-8 left-8" />
            <div className="relative z-10">
              <p className="text-xl text-foreground leading-relaxed mb-8 text-center italic">
                "{testimonials[currentIndex].quote}"
              </p>
              <div className="text-center">
                <p className="font-semibold text-foreground" data-testid="text-testimonial-author">
                  {testimonials[currentIndex].initials}
                </p>
                <p className="text-sm text-muted-foreground">{testimonials[currentIndex].state}</p>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrev}
              data-testid="button-testimonial-prev"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentIndex ? "bg-primary w-8" : "bg-border"
                  }`}
                  data-testid={`button-testimonial-dot-${index}`}
                />
              ))}
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNext}
              data-testid="button-testimonial-next"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
