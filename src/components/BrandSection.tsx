import { Crown, Flame, Users } from "lucide-react";

const BrandSection = () => {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4 text-center max-w-3xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary mb-6">
          <Crown className="w-4 h-4" />
          <span>Sobre a House</span>
        </div>
        <h2 className="font-display text-2xl md:text-4xl font-bold mb-6 glow-text">
          CURADORIA, ESTILO E SABOR NA MEDIDA CERTA.
        </h2>
        <p className="text-muted-foreground text-lg leading-relaxed mb-10">
          A House Headshop nasceu para reunir praticidade, visual premium e sabores marcantes em uma experiência de compra simples. Nosso foco é selecionar produtos que funcionam bem no dia a dia e oferecer atendimento rápido para quem quer comprar sem complicação.
        </p>
        <div className="grid grid-cols-3 gap-6">
          {[
            { icon: Flame, title: "Seleção", desc: "Produtos escolhidos com critério" },
            { icon: Users, title: "Comunidade", desc: "+3.200 clientes atendidos" },
            { icon: Crown, title: "Confiança", desc: "Compra clara do começo ao fim" },
          ].map((item) => (
            <div key={item.title} className="space-y-2">
              <item.icon className="w-8 h-8 text-primary mx-auto" />
              <h3 className="font-display text-sm font-bold text-foreground">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandSection;
