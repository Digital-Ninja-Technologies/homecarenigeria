import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I register my agency on HomeCare Connect?",
    answer: "Registration is simple. Click 'Register Your Agency', fill in your business details, upload your CAC documents and other verification materials, then choose your subscription plan. Our team will review your application within 48 hours."
  },
  {
    question: "What documents are required for agency verification?",
    answer: "You'll need your CAC registration certificate, valid business address proof, tax identification number (TIN), and a list of your current workers with their credentials. Featured agencies may need additional documentation."
  },
  {
    question: "How does the commission structure work?",
    answer: "Commission rates vary by plan: Starter (7%), Professional (5%), and Enterprise (custom rates). The commission is automatically deducted from each completed booking, and you receive consolidated payments for all your workers."
  },
  {
    question: "Can I add workers to my agency after registration?",
    answer: "Yes! You can add workers at any time through your agency dashboard. Professional and Enterprise plans offer bulk upload features for adding multiple workers simultaneously."
  },
  {
    question: "How do payments work for agency bookings?",
    answer: "Clients pay upfront when booking. Funds are held securely until the job is completed and approved. You then receive consolidated weekly payments for all your workers, minus the platform commission."
  },
  {
    question: "What support is available for agencies?",
    answer: "All agencies get access to our support team via chat and email. Professional plans include priority support with faster response times, while Enterprise plans get a dedicated account manager."
  },
  {
    question: "Can I track my workers' performance?",
    answer: "Absolutely. Your agency dashboard provides detailed analytics including individual worker ratings, booking completion rates, client feedback, and revenue trends. This helps you identify top performers and areas for improvement."
  },
  {
    question: "What happens if a client has a complaint about my worker?",
    answer: "We have a structured dispute resolution process. Both parties can submit their concerns, and our support team mediates. For serious issues, we may pause the worker's account pending investigation to protect your agency's reputation."
  },
];

const AgencyFAQ = () => {
  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Got questions? We've got answers. Find everything you need to know about partnering with HomeCare Connect.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-primary/50 transition-colors"
              >
                <AccordionTrigger className="text-left hover:no-underline py-5">
                  <span className="font-semibold text-foreground">{faq.question}</span>
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-5">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default AgencyFAQ;
