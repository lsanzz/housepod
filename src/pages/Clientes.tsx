import { useEffect, useMemo, useState } from "react";
import { Heart, MessageCircle, Package, Save, UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageIntro from "@/components/store/PageIntro";
import ProductCard from "@/components/store/ProductCard";
import SectionHeading from "@/components/store/SectionHeading";
import { formatCurrency, getWhatsAppOrderUrl, loyaltyPerks } from "@/data/store";
import { useStore } from "@/context/StoreContext";

const Clientes = () => {
  const { customer, favoriteProducts, customerOrders, updateCustomer, adminSettings } = useStore();
  const [formValues, setFormValues] = useState(customer);

  useEffect(() => {
    setFormValues(customer);
  }, [customer]);

  const completion = useMemo(() => {
    const fields = [
      formValues.name,
      formValues.email,
      formValues.phone,
      formValues.cep,
      formValues.address,
      formValues.number,
      formValues.city,
      formValues.state,
    ];
    return Math.round((fields.filter(Boolean).length / fields.length) * 100);
  }, [formValues]);

  return (
    <div>
      <PageIntro
        eyebrow="clientes"
        title="Área do cliente com cadastro, favoritos e pedidos"
        description="Salve seus dados, acompanhe pedidos e reúna seus favoritos em um só lugar."
        actions={
          <Button asChild variant="cta" className="rounded-2xl px-6 py-6 text-sm">
            <Link to="/checkout">Finalizar compra</Link>
          </Button>
        }
        aside={
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: "Perfil", value: `${completion}%`, icon: UserRound },
              { label: "Favoritos", value: String(favoriteProducts.length), icon: Heart },
              { label: "Pedidos", value: String(customerOrders.length), icon: Package },
            ].map((item) => (
              <div key={item.label} className="rounded-[28px] border border-white/10 bg-card/75 p-6">
                <item.icon className="h-5 w-5 text-primary" />
                <p className="mt-4 font-display text-3xl font-semibold text-foreground">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="py-12 md:py-16">
        <div className="container grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[32px] border border-white/10 bg-card/75 p-6 md:p-8">
            <SectionHeading
              eyebrow="meu cadastro"
              title="Seus dados para comprar mais rápido"
              description="Essas informações agilizam as próximas compras neste dispositivo."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {[
                { key: "name", label: "Nome completo" },
                { key: "email", label: "E-mail" },
                { key: "phone", label: "Telefone" },
                { key: "cpf", label: "CPF" },
                { key: "cep", label: "CEP" },
                { key: "address", label: "Endereço" },
                { key: "number", label: "Número" },
                { key: "complement", label: "Complemento" },
                { key: "neighborhood", label: "Bairro" },
                { key: "city", label: "Cidade" },
                { key: "state", label: "UF" },
              ].map((field) => (
                <div key={field.key} className={field.key === "address" ? "md:col-span-2" : ""}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {field.label}
                  </label>
                  <Input
                    value={formValues[field.key as keyof typeof formValues]}
                    onChange={(event) =>
                      setFormValues((previous) => ({ ...previous, [field.key]: event.target.value }))
                    }
                    className="h-12 rounded-2xl border-white/10 bg-background/55"
                  />
                </div>
              ))}
            </div>

            <Button
              onClick={() => {
                updateCustomer(formValues);
                toast.success("Seus dados foram atualizados.");
              }}
              variant="cta"
              className="mt-8 rounded-2xl px-6 py-6 text-sm"
            >
              <Save className="h-4 w-4" />
              Salvar cadastro
            </Button>
          </div>

          <div className="space-y-5">
            <div className="rounded-[32px] border border-white/10 bg-[linear-gradient(135deg,hsl(var(--primary)/0.16),hsl(var(--secondary)/0.12))] p-7">
              <h2 className="font-display text-2xl font-semibold text-foreground">Vantagens para clientes</h2>
              <p className="mt-3 text-sm leading-7 text-foreground/80">
                Receba novidades, volte aos produtos favoritos e compre novamente com menos etapas.
              </p>
              <div className="mt-6 grid gap-4">
                {loyaltyPerks.map((perk) => (
                  <div
                    key={perk}
                    className="rounded-2xl border border-white/10 bg-background/45 p-4 text-sm leading-7 text-foreground/85"
                  >
                    {perk}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-card/50 py-14 md:py-18">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="favoritos"
              title="Seus produtos favoritos"
              description="Salve os produtos que mais chamaram sua atenção para retomar a compra depois."
            />
            <Button asChild variant="ctaOutline" className="rounded-2xl px-5 py-6 text-sm">
              <Link to="/vendas">Adicionar mais favoritos</Link>
            </Button>
          </div>

          {favoriteProducts.length ? (
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {favoriteProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="mt-8 rounded-[28px] border border-dashed border-white/15 bg-background/55 p-8 text-center text-muted-foreground">
              Você ainda não salvou nenhum produto. Use o coração no catálogo para montar sua lista.
            </div>
          )}
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="container">
          <SectionHeading
            eyebrow="meus pedidos"
            title="Histórico de pedidos"
            description="Os pedidos enviados deste dispositivo aparecem aqui com status, valor e resumo dos itens."
          />

          <div className="mt-10 grid gap-5">
            {customerOrders.length ? (
              customerOrders.map((order) => (
                <div key={order.id} className="rounded-[28px] border border-white/10 bg-card/75 p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-display text-2xl font-semibold text-foreground">Pedido {order.id}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")} • {order.shippingMethod} • {order.paymentMethod}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                        {order.status}
                      </span>
                      <span className="font-display text-2xl font-semibold text-foreground">
                        {formatCurrency(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button asChild variant="ctaOutline" className="rounded-2xl px-4 py-5 text-sm">
                      <a href={getWhatsAppOrderUrl(order, adminSettings)} target="_blank" rel="noreferrer">
                        <MessageCircle className="h-4 w-4" />
                        Reenviar no WhatsApp
                      </a>
                    </Button>
                  </div>

                  <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.productId}`} className="rounded-2xl border border-white/10 bg-background/55 p-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-16 w-16 rounded-2xl bg-card object-contain p-2"
                          />
                          <div>
                            <p className="font-medium text-foreground">{item.name}</p>
                            <p className="text-sm text-muted-foreground">Qtd: {item.quantity}</p>
                            <p className="mt-1 text-sm text-foreground">{formatCurrency(item.price)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/15 bg-background/55 p-8 text-center text-muted-foreground">
                Nenhum pedido salvo ainda. Finalize uma compra para visualizar seu histórico.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Clientes;
