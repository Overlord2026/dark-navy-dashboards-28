import data from "@/content/pricing_content.json";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PricingFAQ() {
  const { faq, footnotes } = data;

  return (
    <section className="bg-bfo-navy text-bfo-ivory">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          {/* FAQ Section */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8">
              Frequently Asked Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faq.map((item, index) => (
                <AccordionItem 
                  key={index} 
                  value={`item-${index}`}
                  className="bg-white/5 border border-white/10 rounded-lg px-6"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="font-semibold">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-white/80">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Footnotes Section */}
          <div className="border-t border-white/10 pt-8">
            <div className="text-center space-y-2">
              {footnotes.map((footnote, index) => (
                <p key={index} className="text-sm text-white/60">
                  {footnote}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}