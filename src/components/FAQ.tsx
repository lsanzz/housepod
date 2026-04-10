import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Qual é o prazo de entrega?", a: "Os pedidos são preparados em até 24h úteis. O prazo final varia de acordo com a sua região e a modalidade escolhida." },
  { q: "Os produtos têm garantia?", a: "Sim. Caso haja defeito de fabricação, nosso time orienta a troca conforme a política da loja." },
  { q: "Como funciona o pod?", a: "É simples: retire da embalagem, utilize normalmente e troque quando o conteúdo chegar ao fim." },
  { q: "Quais sabores estão disponíveis?", a: "A seleção mistura perfis gelados, frutados e clássicos, com opções para diferentes preferências." },
  { q: "Posso trocar ou devolver?", a: "Se houver problema com o produto, nosso suporte orienta o processo de troca conforme a política da loja." },
  { q: "Vocês enviam para todo o Brasil?", a: "Sim. Trabalhamos com envio para todo o Brasil por meio de parceiros logísticos." },
];

const FAQ = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-2xl">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10 glow-text">
          PERGUNTAS FREQUENTES
        </h2>
        <Accordion type="single" collapsible className="space-y-3">
          {faqs.map((faq, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="glass rounded-xl px-6 border-none">
              <AccordionTrigger className="font-display text-sm font-semibold text-foreground hover:text-primary hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;
