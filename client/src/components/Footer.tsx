import { Link } from "wouter";
import { Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Footer() {
  return (
    <footer className="bg-foreground text-primary-foreground py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Sell My Post Office</h3>
            <p className="text-primary-foreground/80 leading-relaxed">
              Helping USPS-leased property owners maximize value with expert guidance and nationwide buyer access.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <nav className="space-y-2">
              <Link href="/">
                <span className="block text-primary-foreground/80 hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-home">
                  Home
                </span>
              </Link>
              <Link href="/guide">
                <span className="block text-primary-foreground/80 hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-guide">
                  Complete Guide 2025
                </span>
              </Link>
              <Link href="/about">
                <span className="block text-primary-foreground/80 hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-about">
                  About
                </span>
              </Link>
              <Link href="/contact">
                <span className="block text-primary-foreground/80 hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-contact">
                  Contact
                </span>
              </Link>
              <Link href="/blog">
                <span className="block text-primary-foreground/80 hover:text-primary transition-colors cursor-pointer" data-testid="footer-link-blog">
                  Blog
                </span>
              </Link>
            </nav>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Get In Touch</h4>
            <a
              href="mailto:info@sellmypostoffice.com"
              className="flex items-center space-x-2 text-primary-foreground/80 hover:text-primary transition-colors"
              data-testid="link-email"
            >
              <Mail className="w-5 h-5" />
              <span>info@sellmypostoffice.com</span>
            </a>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-primary-foreground/20">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-primary-foreground/60">
              &copy; {new Date().getFullYear()} Sell My Post Office. All rights reserved.
            </p>
            
            <div className="flex gap-6 text-sm">
              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary-foreground/60 hover:text-primary transition-colors underline" data-testid="button-privacy">
                    Privacy Policy
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Privacy Policy</DialogTitle>
                    <DialogDescription>
                      Last updated: {new Date().toLocaleDateString()}
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4 text-sm">
                      <section>
                        <h3 className="font-semibold text-base mb-2">Information We Collect</h3>
                        <p className="text-muted-foreground">
                          We collect information you provide directly to us, including your name, email address, 
                          phone number, property details, and any other information you choose to provide when 
                          requesting a property valuation or contacting us.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">How We Use Your Information</h3>
                        <p className="text-muted-foreground">
                          We use the information we collect to provide you with property valuations, connect you 
                          with qualified buyers, communicate with you about our services, and improve our website 
                          and services. We do not sell or rent your personal information to third parties.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Information Sharing</h3>
                        <p className="text-muted-foreground">
                          We may share your information with qualified buyers and partners who assist us in 
                          providing our services. All parties are required to maintain the confidentiality of 
                          your information and use it only for the purposes of facilitating your transaction.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Data Security</h3>
                        <p className="text-muted-foreground">
                          We implement appropriate technical and organizational measures to protect your personal 
                          information against unauthorized access, alteration, disclosure, or destruction.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Your Rights</h3>
                        <p className="text-muted-foreground">
                          You have the right to access, correct, or delete your personal information at any time. 
                          To exercise these rights, please contact us at info@sellmypostoffice.com.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Contact Us</h3>
                        <p className="text-muted-foreground">
                          If you have any questions about this Privacy Policy, please contact us at 
                          info@sellmypostoffice.com.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary-foreground/60 hover:text-primary transition-colors underline" data-testid="button-terms">
                    Terms of Use
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Terms of Use</DialogTitle>
                    <DialogDescription>
                      Last updated: {new Date().toLocaleDateString()}
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4 text-sm">
                      <section>
                        <h3 className="font-semibold text-base mb-2">Acceptance of Terms</h3>
                        <p className="text-muted-foreground">
                          By accessing and using this website, you accept and agree to be bound by these Terms of 
                          Use. If you do not agree to these terms, please do not use this website.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Services</h3>
                        <p className="text-muted-foreground">
                          This website provides information about selling USPS-leased properties and facilitates 
                          connections between property owners and qualified buyers. We do not guarantee any specific 
                          valuation amounts or sale prices.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">No Broker-Client Relationship</h3>
                        <p className="text-muted-foreground">
                          This service does not create a broker-client relationship. We connect property owners 
                          with buyers but do not act as licensed real estate brokers. You should consult with 
                          appropriate legal and financial professionals before making any property decisions.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Accuracy of Information</h3>
                        <p className="text-muted-foreground">
                          While we strive to provide accurate information, we make no warranties about the 
                          completeness, reliability, or accuracy of the information on this website. Property 
                          valuations are estimates and not guarantees of sale price.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Limitation of Liability</h3>
                        <p className="text-muted-foreground">
                          We shall not be liable for any indirect, incidental, special, or consequential damages 
                          arising from your use of this website or services.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Changes to Terms</h3>
                        <p className="text-muted-foreground">
                          We reserve the right to modify these terms at any time. Continued use of the website 
                          after changes constitutes acceptance of the modified terms.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>

              <Dialog>
                <DialogTrigger asChild>
                  <button className="text-primary-foreground/60 hover:text-primary transition-colors underline" data-testid="button-disclaimer">
                    Disclaimer
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-3xl max-h-[80vh]">
                  <DialogHeader>
                    <DialogTitle>Disclaimer</DialogTitle>
                    <DialogDescription>
                      Important information about our services
                    </DialogDescription>
                  </DialogHeader>
                  <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-4 text-sm">
                      <section>
                        <h3 className="font-semibold text-base mb-2">Not a Licensed Broker</h3>
                        <p className="text-muted-foreground">
                          This website and its operators are not licensed real estate brokers or agents. We provide 
                          a platform to connect USPS-leased property owners with qualified buyers and do not 
                          represent either party in transactions.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">No USPS Affiliation</h3>
                        <p className="text-muted-foreground">
                          This website is not affiliated with, endorsed by, or sponsored by the United States Postal 
                          Service (USPS). References to USPS are for descriptive purposes only in relation to 
                          properties that are leased to or by USPS.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Valuation Estimates</h3>
                        <p className="text-muted-foreground">
                          Property valuations provided are estimates based on available information and market 
                          analysis. Actual sale prices may vary significantly. Valuations are not appraisals and 
                          should not be relied upon as such.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">No Guarantees</h3>
                        <p className="text-muted-foreground">
                          We make no guarantees regarding sale prices, time to close, or the ability to sell any 
                          specific property. All transactions are subject to buyer due diligence, financing, and 
                          other customary conditions.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Professional Advice</h3>
                        <p className="text-muted-foreground">
                          Information on this website is for general informational purposes only and does not 
                          constitute legal, tax, or financial advice. You should consult with appropriate licensed 
                          professionals before making any property decisions.
                        </p>
                      </section>
                      
                      <section>
                        <h3 className="font-semibold text-base mb-2">Third-Party Buyers</h3>
                        <p className="text-muted-foreground">
                          While we work with qualified buyers, we do not guarantee the financial capability or 
                          reliability of any buyer. Property owners should conduct their own due diligence on 
                          potential buyers and transactions.
                        </p>
                      </section>
                    </div>
                  </ScrollArea>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
