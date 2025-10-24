import Header from "@/components/Header";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import CTABand from "@/components/CTABand";
import ValuePropsGrid from "@/components/ValuePropsGrid";
import TestimonialCarousel from "@/components/TestimonialCarousel";
import RecentSales from "@/components/RecentSales";
import FAQ from "@/components/FAQ";
import ContactForm from "@/components/ContactForm";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";

export default function Home() {
  return (
    <>
      <SEOHead
        title="Sell Your USPS Post Office Property | Top Dollar, No Broker Fees"
        description="Get a free confidential valuation and strong cash offer for your USPS-leased post office property. Connect with nationwide buyers, close in 45 days, pay zero commissions."
        canonical="/"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Hero />
          <HowItWorks />
          <CTABand />
          <ValuePropsGrid />
          <RecentSales />
          <TestimonialCarousel />
          <FAQ />
          
          {/* Contact Teaser */}
          <section className="py-20 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                    Have Questions?
                  </h2>
                  <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                    Get in touch with our team to discuss your property. We're here to answer 
                    any questions and help you understand the full value of your USPS-leased asset.
                  </p>
                  <Link href="/contact">
                    <span className="text-primary font-semibold hover:underline cursor-pointer" data-testid="link-full-contact">
                      Go to full contact form →
                    </span>
                  </Link>
                </div>
                <div>
                  <ContactForm isTeaser={true} />
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
