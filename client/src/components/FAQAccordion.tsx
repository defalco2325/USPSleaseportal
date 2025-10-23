import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

//todo: remove mock functionality
const faqs = [
  {
    question: "What is a USPS-leased property?",
    answer: "A USPS-leased property is a building where the United States Postal Service operates a post office under a long-term lease agreement. These properties typically have stable, government-backed income streams.",
  },
  {
    question: "How is my property valued?",
    answer: "Valuation is based on several factors including the cap rate, remaining lease term, rental rate, property condition, location, and comparable sales in the market. Our experts analyze all these elements to provide an accurate assessment.",
  },
  {
    question: "How long does the selling process take?",
    answer: "From initial valuation to closing, the process typically takes 45-60 days. However, motivated sellers can often close faster, sometimes in as few as 30 days, depending on their specific situation.",
  },
  {
    question: "Do I have to pay broker fees?",
    answer: "No. Unlike traditional real estate transactions, we don't charge broker commissions or fees. You keep 100% of the sale price.",
  },
  {
    question: "What if my lease is expiring soon?",
    answer: "Properties with shorter remaining lease terms can still be valuable. We work with buyers who understand USPS lease renewal patterns and can make competitive offers based on the property's potential.",
  },
  {
    question: "Is the valuation really free and confidential?",
    answer: "Yes, absolutely. There's no cost or obligation for the initial valuation, and all information you share is kept strictly confidential throughout the process.",
  },
];

export default function FAQAccordion() {
  return (
    <div className="w-full">
      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqs.map((faq, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border border-border rounded-lg px-6"
            data-testid={`accordion-faq-${index}`}
          >
            <AccordionTrigger className="text-left font-semibold text-foreground hover:text-primary">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
