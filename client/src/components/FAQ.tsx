import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I know if my property qualifies?",
    answer: "Any property with an active USPS lease typically qualifies. We work with single-tenant post offices, multi-tenant buildings with USPS as a tenant, and purpose-built postal facilities. Submit your property details for a free valuation to confirm eligibility.",
  },
  {
    question: "What is my USPS-leased property worth?",
    answer: "Property values depend on several factors including lease terms, location, building condition, remaining lease duration, and rental income. Our expert team provides a detailed, confidential valuation report within 24-48 hours of your submission.",
  },
  {
    question: "How long does the selling process take?",
    answer: "From accepting an offer to closing, the typical timeline is 45-60 days. This includes due diligence, financing approval (if applicable), and title work. We streamline the process to close as quickly as possible while ensuring all details are handled properly.",
  },
  {
    question: "Do I really pay zero broker fees?",
    answer: "Yes, absolutely. Unlike traditional real estate transactions that charge 5-6% commissions, our service is completely free to property owners. Buyers cover all transaction costs, so you keep 100% of the agreed sale price.",
  },
  {
    question: "Will USPS know I'm selling?",
    answer: "The process is completely confidential until you choose to move forward. Initial valuations and offers are conducted discreetly. USPS notification requirements depend on your specific lease terms, which we'll review with you during the process.",
  },
  {
    question: "What if my USPS lease expires soon?",
    answer: "Properties with shorter remaining lease terms can still be valuable. Many buyers specialize in lease renewals and renegotiations with USPS. We'll connect you with buyers who understand how to maximize value even with upcoming lease expirations.",
  },
  {
    question: "Can I still collect rent while I'm selling?",
    answer: "Yes, you continue to receive all rental income from USPS throughout the entire selling process. Your income stream is uninterrupted from initial valuation through closing day.",
  },
  {
    question: "What documents will I need to provide?",
    answer: "You'll need your current USPS lease agreement, property tax records, insurance information, and any maintenance records. Our team will provide a complete checklist and help you gather everything needed for a smooth transaction.",
  },
];

export default function FAQ() {
  return (
    <section className="py-20 bg-background" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get answers to common questions about selling your USPS-leased property
          </p>
        </div>

        <div className="animate-fade-in-up">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 hover-elevate transition-all duration-300 data-[state=open]:border-primary/30"
                data-testid={`accordion-faq-${index}`}
              >
                <AccordionTrigger className="text-left hover:no-underline py-5 text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
