import { Link } from "wouter";
import { Mail } from "lucide-react";

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

        <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} Sell My Post Office. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
