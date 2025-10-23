import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import ContactForm from "@/components/ContactForm";
import { Mail, MapPin, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Contact() {
  return (
    <>
      <SEOHead
        title="Contact Us - Get Your Free USPS Property Valuation"
        description="Contact our team to get a free, confidential valuation for your USPS-leased post office property. Expert guidance, nationwide buyers, no broker fees."
        canonical="/contact"
      />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 bg-background">
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-2xl mx-auto text-center mb-16">
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                  Get In Touch
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Have questions about selling your USPS-leased property? Our team is here to help. 
                  Fill out the form below and we'll respond within 24 hours.
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-8 mb-16">
                <Card className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Email Us</h3>
                  <a
                    href="mailto:info@sellmypostoffice.com"
                    className="text-primary hover:underline"
                    data-testid="link-contact-email"
                  >
                    info@sellmypostoffice.com
                  </a>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Response Time</h3>
                  <p className="text-muted-foreground">Within 24 hours</p>
                </Card>

                <Card className="p-6 text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Coverage</h3>
                  <p className="text-muted-foreground">Nationwide</p>
                </Card>
              </div>

              <div className="max-w-2xl mx-auto">
                <ContactForm />
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
