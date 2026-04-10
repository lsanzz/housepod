import { Link } from "react-router-dom";
import { BadgeCheck, Flame, LayoutGrid, Rocket, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageIntro from "@/components/store/PageIntro";
import SectionHeading from "@/components/store/SectionHeading";
import { aboutStats, loyaltyPerks } from "@/data/store";

const pillars = [
  {
    title: "Curadoria de sabores",
    description: "Seleção equilibrada entre gelados, frutados e opções para o dia a dia.",
    icon: LayoutGrid,
  },
  {
    title: "Compra sem complicação",
    description: "Da vitrine ao checkout, tudo foi pensado para navegar rápido e comprar com confiança.",
    icon: Rocket,
  },
  {
    title: "Atendimento próximo",
    description: "Pedido claro, WhatsApp direto e suporte para acompanhar cada etapa da compra.",
    icon: ShieldCheck,
  },
];

const Sobre = () => {
  return (
    <div>
      <PageIntro
        eyebrow="sobre"
        title="A House foi criada para unir sabor, estilo e praticidade"
        description="Mais do que uma vitrine, somos uma loja pensada para quem quer comprar bem, receber rápido e voltar sempre."
        actions={
          <>
            <Button asChild variant="cta" className="rounded-2xl px-6 py-6 text-sm">
              <Link to="/vendas">Explorar catálogo</Link>
            </Button>
            <Button asChild variant="ctaOutline" className="rounded-2xl px-6 py-6 text-sm">
              <Link to="/clientes">Minha área</Link>
            </Button>
          </>
        }
        aside={
          <div className="grid gap-4 sm:grid-cols-2">
            {aboutStats.map((stat) => (
              <div key={stat.label} className="rounded-[28px] border border-white/10 bg-card/75 p-6">
                <p className="font-display text-3xl font-semibold text-foreground">{stat.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="py-12 md:py-16">
        <div className="container grid gap-6 lg:grid-cols-3">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="rounded-[28px] border border-white/10 bg-card/75 p-7">
              <div className="mb-4 inline-flex rounded-2xl bg-primary/12 p-3 text-primary">
                <pillar.icon className="h-5 w-5" />
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground">{pillar.title}</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">{pillar.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-card/50 py-14 md:py-18">
        <div className="container grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <SectionHeading
            eyebrow="nossa essência"
            title="Curadoria premium, atendimento próximo e experiência sem complicação"
            description="Conheça a proposta da House e o que torna a experiência de compra mais simples e confiável."
          />
          <div className="rounded-[32px] border border-white/10 bg-background/60 p-7 md:p-8">
            <p className="text-base leading-8 text-muted-foreground">
              A House Headshop reúne pods, refis, nic salts e acessórios escolhidos para quem valoriza sabor marcante, visual premium e praticidade no dia a dia.
            </p>
            <p className="mt-5 text-base leading-8 text-muted-foreground">
              Nosso foco é oferecer uma jornada simples: encontrar rápido, fechar o pedido com segurança e acompanhar tudo com clareza até a entrega.
            </p>
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="container grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-card/75 p-7 md:p-8">
            <div className="flex items-center gap-3">
              <Flame className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl font-semibold text-foreground">O que você encontra aqui</h2>
            </div>
            <div className="mt-6 grid gap-4 text-sm text-muted-foreground">
              {[
                "Catálogo com destaques, novidades e filtros por categoria.",
                "Área do cliente para salvar dados, favoritos e acompanhar pedidos.",
                "Página de entrega com modalidades, prazos e condição de frete grátis.",
                "Checkout direto com resumo completo e envio para o WhatsApp da loja.",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-background/55 p-4">
                  <BadgeCheck className="mt-0.5 h-4 w-4 text-primary" />
                  <span className="leading-7">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,hsl(var(--secondary)/0.16),hsl(var(--primary)/0.14))] p-7 md:p-8">
            <h2 className="font-display text-2xl font-semibold text-foreground">Vantagens para clientes cadastrados</h2>
            <p className="mt-3 text-sm leading-7 text-foreground/80">
              Ao salvar seus dados, você ganha mais agilidade nas próximas compras e recebe ofertas com mais facilidade.
            </p>
            <div className="mt-6 grid gap-4">
              {loyaltyPerks.map((perk) => (
                <div key={perk} className="rounded-2xl border border-white/10 bg-background/45 p-4 text-sm leading-7 text-foreground/85">
                  {perk}
                </div>
              ))}
            </div>
            <Button asChild variant="cta" className="mt-6 rounded-2xl px-6 py-6 text-sm">
              <Link to="/clientes">Abrir área do cliente</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Sobre;
