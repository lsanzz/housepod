import { Wind, Zap, SmartphoneNfc, Battery, Palette, ShieldCheck } from "lucide-react";

const benefits = [
  { icon: Wind, title: "Vapor equilibrado", desc: "Experiência suave com sabor consistente do começo ao fim" },
  { icon: Zap, title: "Uso descomplicado", desc: "Pegou, usou, curtiu. Sem ajustes e sem enrolação" },
  { icon: SmartphoneNfc, title: "Portátil de verdade", desc: "Cabe no bolso e acompanha a rotina sem ocupar espaço" },
  { icon: Battery, title: "Boa autonomia", desc: "Bateria pensada para render bem ao longo do dia" },
  { icon: Palette, title: "Sabores variados", desc: "Opções frutadas, geladas e clássicas para todos os estilos" },
  { icon: ShieldCheck, title: "Compra segura", desc: "Atendimento rápido e produtos escolhidos com cuidado" },
];

const Benefits = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4 glow-text">
          POR QUE COMPRAR NA HOUSE?
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Curadoria premium, sabores marcantes e experiência simples do primeiro clique até a entrega.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div
              key={b.title}
              className="glass rounded-xl p-6 card-glow transition-all duration-300 group opacity-0 animate-fade-in"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-lg gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <b.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="font-display text-sm md:text-base font-bold mb-2 text-foreground">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
