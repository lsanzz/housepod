import { Star, Users, Package, ThumbsUp } from "lucide-react";

const stats = [
  { icon: Users, value: "+2.500", label: "Clientes satisfeitos" },
  { icon: Star, value: "4.9", label: "Avaliação média" },
  { icon: Package, value: "+5.000", label: "Pedidos entregues" },
  { icon: ThumbsUp, value: "98%", label: "Taxa de satisfação" },
];

const testimonials = [
  { name: "Lucas M.", text: "Sabor consistente e envio rápido. Já virei cliente recorrente.", rating: 5 },
  { name: "Ana P.", text: "Gostei muito da navegação e da clareza no resumo do pedido.", rating: 5 },
  { name: "Rafael S.", text: "Atendimento ágil no WhatsApp e produtos bem embalados.", rating: 5 },
];

const SocialProof = () => {
  return (
    <section className="relative py-20 bg-card/50">
      <div className="container mx-auto px-4">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center glass rounded-xl p-6 card-glow transition-all duration-300">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="font-display text-3xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-10 glow-text">
          QUEM COMPRA, RECOMENDA
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="glass rounded-xl p-6 card-glow transition-all duration-300">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-foreground/90 mb-4 italic">"{t.text}"</p>
              <p className="text-sm font-semibold text-primary">{t.name}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
