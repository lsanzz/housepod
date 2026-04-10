import { FormEvent, useState } from "react";
import { CreditCard, ShieldCheck, TicketPercent, Truck } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { categories, getCategoryLabel } from "@/data/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const footerLinks = [
  { label: "Início", to: "/" },
  { label: "Catálogo", to: "/vendas" },
  { label: "Sobre", to: "/sobre" },
  { label: "Entrega", to: "/entrega" },
  { label: "Clientes", to: "/clientes" },
  { label: "Carrinho", to: "/checkout" },
];

const SiteFooter = () => {
  const [email, setEmail] = useState("");

  const handleNewsletter = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Digite um e-mail válido para receber o cupom.");
      return;
    }
    toast.success("Cupom de 5% reservado para este e-mail.");
    setEmail("");
  };

  return (
    <footer className="border-t border-white/10 bg-card/75">
      <div className="container py-14">
        <div className="grid gap-6 rounded-[32px] border border-white/10 bg-background/70 p-6 md:grid-cols-3 md:p-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Receba novidades
            </span>
            <h3 className="font-display text-3xl font-semibold text-foreground">Ganhe 5% na primeira compra</h3>
            <p className="text-sm leading-6 text-muted-foreground">
              Cadastre seu e-mail para receber cupons, lançamentos e ofertas especiais da House.
            </p>
          </div>

          <form onSubmit={handleNewsletter} className="md:col-span-2">
            <div className="flex h-full flex-col justify-center gap-3 md:flex-row">
              <Input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Digite seu e-mail"
                className="h-12 rounded-2xl border-white/10 bg-card/70"
              />
              <Button type="submit" variant="cta" className="h-12 rounded-2xl px-6">
                Quero meu cupom
              </Button>
            </div>
          </form>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.1fr_0.9fr_0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] text-primary-foreground">
                HH
              </div>
              <div>
                <p className="font-display text-lg font-semibold text-foreground">HOUSE HEADSHOP</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">loja premium</p>
              </div>
            </div>
            <p className="max-w-sm text-sm leading-6 text-muted-foreground">
              Curadoria de pods, refis, nic salts e acessórios com visual premium e compra sem complicação.
            </p>
            <div className="grid gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/60 p-3">
                <Truck className="h-4 w-4 text-primary" />
                Frete rápido por região
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/60 p-3">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Pedido finalizado com resumo completo
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/60 p-3">
                <TicketPercent className="h-4 w-4 text-primary" />
                Ofertas e benefícios para clientes
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold text-foreground">Categorias</h4>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {categories
                .filter((category) => category !== "Todos")
                .map((category) => (
                  <Link key={category} to={`/vendas?categoria=${encodeURIComponent(category)}`} className="transition hover:text-foreground">
                    {getCategoryLabel(category)}
                  </Link>
                ))}
            </div>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold text-foreground">Navegação</h4>
            <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
              {footerLinks.map((item) => (
                <Link key={item.to} to={item.to} className="transition hover:text-foreground">
                  {item.label}
                </Link>
              ))}
              <span>Política de envios</span>
              <span>Garantia e trocas</span>
              <span>Privacidade</span>
            </div>
          </div>

          <div>
            <h4 className="font-display text-xl font-semibold text-foreground">Contato</h4>
            <div className="mt-4 space-y-4 text-sm text-muted-foreground">
              <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
                <p className="font-medium text-foreground">WhatsApp</p>
                <p>(11) 99999-0000</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
                <p className="font-medium text-foreground">E-mail</p>
                <p>contato@househeadshop.com.br</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-background/60 p-4">
                <p className="font-medium text-foreground">Pagamentos aceitos</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-primary">
                    <CreditCard className="h-3.5 w-3.5" />
                    Cartão
                  </span>
                  <span className="rounded-full bg-secondary/10 px-3 py-1 text-secondary">PIX</span>
                  <span className="rounded-full bg-white/5 px-3 py-1 text-foreground">Boleto</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>HOUSE HEADSHOP © 2026. Pods, refis e acessórios com atendimento especializado.</p>
          <p>Venda destinada a maiores de 18 anos.</p>
        </div>
      </div>
    </footer>
  );
};

export default SiteFooter;
