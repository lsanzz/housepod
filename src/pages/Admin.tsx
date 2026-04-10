import { useMemo, useState } from "react";
import { Lock, Package, Plus, ShoppingBag, Store, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageIntro from "@/components/store/PageIntro";
import SectionHeading from "@/components/store/SectionHeading";
import { categories, formatCurrency, getCategoryLabel, getStoreStatus, placeholderProductImage, type CustomProductInput, type Product } from "@/data/store";
import { useStore } from "@/context/StoreContext";

const categoryOptions = categories.filter((category) => category !== "Todos") as Array<Exclude<(typeof categories)[number], "Todos">>;

const emptyNewProduct: Omit<CustomProductInput, "id"> = {
  name: "",
  category: "Pods Descartaveis",
  price: 0,
  compareAtPrice: undefined,
  image: "",
  badge: "",
  description: "",
  highlight: "",
  stockQuantity: 0,
  active: true,
  featured: false,
};

const Admin = () => {
  const {
    adminSettings,
    updateAdminSettings,
    products,
    updateProductAdmin,
    addProduct,
    updateCustomProduct,
    deleteProduct,
    managedUsers,
    updateManagedUser,
    orders,
    isRealtimeEnabled,
  } = useStore();
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [search, setSearch] = useState("");
  const [newProduct, setNewProduct] = useState<Omit<CustomProductInput, "id">>(emptyNewProduct);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const storeStatus = useMemo(() => getStoreStatus(new Date(), adminSettings), [adminSettings]);

  const filteredProducts = useMemo(
    () => products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase())),
    [products, search],
  );
  const totalStock = useMemo(
    () => products.reduce((sum, product) => sum + (product.stockQuantity ?? 0), 0),
    [products],
  );
  const totalRevenue = useMemo(() => orders.reduce((sum, order) => sum + order.total, 0), [orders]);

  const updateNewProduct = <K extends keyof Omit<CustomProductInput, "id">>(key: K, value: Omit<CustomProductInput, "id">[K]) => {
    setNewProduct((previous) => ({ ...previous, [key]: value }));
  };

  const handleCreateProduct = async () => {
    setIsSavingProduct(true);
    const createdId = await addProduct({
      ...newProduct,
      image: newProduct.image?.trim() || placeholderProductImage,
      badge: newProduct.badge?.trim() || undefined,
      compareAtPrice: newProduct.compareAtPrice || undefined,
    });
    setIsSavingProduct(false);

    if (createdId) {
      setNewProduct(emptyNewProduct);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    const confirmed = window.confirm(`Deseja excluir o produto \"${product.name}\"?`);
    if (!confirmed) return;

    try {
      await deleteProduct(product.id);
    } catch (error) {
      console.error("Falha ao excluir produto", error);
      toast.error("Não foi possível excluir o produto.");
    }
  };

  if (!unlocked) {
    return (
      <div>
        <PageIntro
          eyebrow="central"
          title="Central da loja"
          description="Organize disponibilidade, estoque, mensagens, pedidos e clientes em um só lugar."
        />

        <section className="py-12 md:py-16">
          <div className="container max-w-xl">
            <div className="rounded-[32px] border border-white/10 bg-card/75 p-8 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Lock className="h-7 w-7" />
              </div>
              <h2 className="mt-6 font-display text-3xl font-semibold text-foreground">Entrar na central</h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                PIN padrão: <strong>1234</strong>. Depois de entrar, você pode trocar esse PIN na própria central.
              </p>
              <Input
                value={pin}
                onChange={(event) => setPin(event.target.value)}
                type="password"
                className="mt-6 h-12 rounded-2xl border-white/10 bg-background/55 text-center text-lg tracking-[0.3em]"
                placeholder="Digite o PIN"
              />
              <Button
                className="mt-4 w-full rounded-2xl py-6"
                variant="cta"
                onClick={() => {
                  if (pin === adminSettings.accessPin) {
                    setUnlocked(true);
                    toast.success("Acesso liberado.");
                    return;
                  }

                  toast.error("PIN incorreto.");
                }}
              >
                Entrar
              </Button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageIntro
        eyebrow="central"
        title="Central da loja"
        description="Acompanhe disponibilidade, dados da loja, estoque e clientes em uma única visão."
        aside={
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { label: "Status", value: storeStatus.shortLabel, icon: Store },
              { label: "Clientes", value: String(managedUsers.length), icon: Users },
              { label: "Produtos", value: String(products.length), icon: Package },
              { label: "Pedidos", value: String(orders.length), icon: ShoppingBag },
            ].map((item) => (
              <div key={item.label} className="rounded-[28px] border border-white/10 bg-card/75 p-6">
                <item.icon className="h-5 w-5 text-primary" />
                <p className="mt-4 font-display text-2xl font-semibold text-foreground">{item.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="py-12 md:py-16">
        <div className="container grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[32px] border border-white/10 bg-card/75 p-6 md:p-8">
            <SectionHeading
              eyebrow="loja"
              title="Configurações gerais da loja"
              description="Tudo o que impacta o topo da loja, checkout e WhatsApp pode ser ajustado aqui."
            />

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-background/55 p-4 md:col-span-2">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Modo de atendimento
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant={adminSettings.availabilityMode === "manual" ? "cta" : "ctaOutline"}
                    className="rounded-2xl"
                    onClick={() => updateAdminSettings({ availabilityMode: "manual" })}
                  >
                    Manual
                  </Button>
                  <Button
                    type="button"
                    variant={adminSettings.availabilityMode === "schedule" ? "cta" : "ctaOutline"}
                    className="rounded-2xl"
                    onClick={() => updateAdminSettings({ availabilityMode: "schedule" })}
                  >
                    Horário comercial
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-background/55 p-4 md:col-span-2">
                <label className="mb-3 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Disponibilidade manual
                </label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant={adminSettings.manualOpen ? "cta" : "ctaOutline"}
                    className="rounded-2xl"
                    onClick={() => updateAdminSettings({ manualOpen: true, availabilityMode: "manual" })}
                  >
                    Disponível agora
                  </Button>
                  <Button
                    type="button"
                    variant={!adminSettings.manualOpen ? "cta" : "ctaOutline"}
                    className="rounded-2xl"
                    onClick={() => updateAdminSettings({ manualOpen: false, availabilityMode: "manual" })}
                  >
                    Pausar atendimento
                  </Button>
                </div>
                <p className="mt-3 text-sm text-muted-foreground">Status atual: {storeStatus.label}</p>
              </div>

              {[
                ["storeName", "Nome da loja", adminSettings.storeName],
                ["whatsappNumber", "WhatsApp da loja", adminSettings.whatsappNumber],
                ["whatsappDisplay", "WhatsApp exibido", adminSettings.whatsappDisplay],
                ["freeShippingThreshold", "Frete grátis a partir de", String(adminSettings.freeShippingThreshold)],
                ["accessPin", "PIN de acesso", adminSettings.accessPin],
              ].map(([key, label, value]) => (
                <div key={key} className={key === "storeName" ? "md:col-span-2" : ""}>
                  <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {label}
                  </label>
                  <Input
                    value={value}
                    onChange={(event) =>
                      updateAdminSettings({
                        [key]: key === "freeShippingThreshold" ? Number(event.target.value || 0) : event.target.value,
                      } as never)
                    }
                    className="h-12 rounded-2xl border-white/10 bg-background/55"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Mensagem no topo
                </label>
                <Input
                  value={adminSettings.highlightMessage}
                  onChange={(event) => updateAdminSettings({ highlightMessage: event.target.value })}
                  className="h-12 rounded-2xl border-white/10 bg-background/55"
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Mensagem de atendimento
                </label>
                <Input
                  value={adminSettings.manualMessage}
                  onChange={(event) => updateAdminSettings({ manualMessage: event.target.value })}
                  className="h-12 rounded-2xl border-white/10 bg-background/55"
                />
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="rounded-[32px] border border-white/10 bg-card/75 p-6 md:p-8">
              <SectionHeading
                eyebrow="resumo"
                title="Números da operação"
                description={
                  isRealtimeEnabled
                    ? "Visão rápida do que está sincronizado com a base da loja em tempo real."
                    : "Visão rápida dos dados salvos neste navegador. Configure o Firebase para sincronizar em tempo real."
                }
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-background/55 p-5">
                  <p className="text-sm text-muted-foreground">Estoque total</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-foreground">{totalStock}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 p-5">
                  <p className="text-sm text-muted-foreground">Faturamento registrado</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-foreground">{formatCurrency(totalRevenue)}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 p-5">
                  <p className="text-sm text-muted-foreground">Pedidos</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-foreground">{orders.length}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-background/55 p-5">
                  <p className="text-sm text-muted-foreground">Clientes</p>
                  <p className="mt-2 font-display text-3xl font-semibold text-foreground">{managedUsers.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-card/50 py-14 md:py-18">
        <div className="container">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              eyebrow="estoque"
              title="Produtos, preços e estoque"
              description="Agora você pode editar, adicionar e excluir produtos direto na central."
            />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Buscar produto"
              className="h-12 max-w-sm rounded-2xl border-white/10 bg-background/55"
            />
          </div>

          <div className="mt-8 rounded-[28px] border border-dashed border-primary/30 bg-background/45 p-5 md:p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-primary/15 p-3 text-primary">
                <Plus className="h-5 w-5" />
              </div>
              <div>
                <p className="font-display text-xl font-semibold text-foreground">Adicionar novo produto</p>
                <p className="text-sm text-muted-foreground">Crie um produto novo e publique na loja em tempo real.</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="xl:col-span-2">
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Nome</label>
                <Input value={newProduct.name} onChange={(event) => updateNewProduct("name", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-card/70" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Categoria</label>
                <select value={newProduct.category} onChange={(event) => updateNewProduct("category", event.target.value as CustomProductInput["category"])} className="h-11 w-full rounded-2xl border border-white/10 bg-card/70 px-3 text-sm text-foreground outline-none">
                  {categoryOptions.map((category) => (
                    <option key={category} value={category}>{getCategoryLabel(category)}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Preço</label>
                <Input type="number" value={newProduct.price} onChange={(event) => updateNewProduct("price", Number(event.target.value || 0))} className="h-11 rounded-2xl border-white/10 bg-card/70" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Preço de</label>
                <Input type="number" value={newProduct.compareAtPrice ?? 0} onChange={(event) => updateNewProduct("compareAtPrice", Number(event.target.value || 0) || undefined)} className="h-11 rounded-2xl border-white/10 bg-card/70" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Estoque</label>
                <Input type="number" value={newProduct.stockQuantity} onChange={(event) => updateNewProduct("stockQuantity", Number(event.target.value || 0))} className="h-11 rounded-2xl border-white/10 bg-card/70" />
              </div>
              <div>
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Badge</label>
                <Input value={newProduct.badge ?? ""} onChange={(event) => updateNewProduct("badge", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-card/70" />
              </div>
              <div className="xl:col-span-4">
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Imagem (URL)</label>
                <Input value={newProduct.image} onChange={(event) => updateNewProduct("image", event.target.value)} placeholder="https://..." className="h-11 rounded-2xl border-white/10 bg-card/70" />
              </div>
              <div className="xl:col-span-2">
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Descrição</label>
                <Input value={newProduct.description} onChange={(event) => updateNewProduct("description", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-card/70" />
              </div>
              <div className="xl:col-span-2">
                <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Destaque curto</label>
                <Input value={newProduct.highlight} onChange={(event) => updateNewProduct("highlight", event.target.value)} className="h-11 rounded-2xl border-white/10 bg-card/70" />
              </div>
              <div className="flex flex-col justify-end gap-2">
                <Button type="button" variant={newProduct.featured ? "cta" : "ctaOutline"} className="rounded-2xl" onClick={() => updateNewProduct("featured", !newProduct.featured)}>
                  {newProduct.featured ? "Em destaque" : "Destacar produto"}
                </Button>
              </div>
              <div className="flex flex-col justify-end gap-2">
                <Button type="button" variant={newProduct.active ? "cta" : "ctaOutline"} className="rounded-2xl" onClick={() => updateNewProduct("active", !newProduct.active)}>
                  {newProduct.active ? "Produto ativo" : "Produto oculto"}
                </Button>
              </div>
              <div className="flex flex-col justify-end gap-2 xl:col-span-2">
                <Button type="button" variant="cta" className="rounded-2xl" onClick={handleCreateProduct} disabled={isSavingProduct}>
                  <Plus className="h-4 w-4" />
                  {isSavingProduct ? "Salvando..." : "Adicionar produto"}
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4">
            {filteredProducts.map((product) => {
              const isCustomProduct = product.source === "custom";
              return (
                <div key={product.id} className="rounded-[28px] border border-white/10 bg-background/55 p-5">
                  <div className="grid gap-4 xl:grid-cols-[1.2fr_repeat(6,minmax(0,1fr))]">
                    <div className="space-y-2">
                      {isCustomProduct ? (
                        <>
                          <Input value={product.name} onChange={(event) => updateCustomProduct(product.id, { name: event.target.value })} className="h-11 rounded-2xl border-white/10 bg-card/70 font-display text-base" />
                          <select value={product.category} onChange={(event) => updateCustomProduct(product.id, { category: event.target.value as CustomProductInput["category"] })} className="h-11 w-full rounded-2xl border border-white/10 bg-card/70 px-3 text-sm text-foreground outline-none">
                            {categoryOptions.map((category) => (
                              <option key={category} value={category}>{getCategoryLabel(category)}</option>
                            ))}
                          </select>
                        </>
                      ) : (
                        <>
                          <p className="font-display text-xl font-semibold text-foreground">{product.name}</p>
                          <p className="mt-1 text-sm text-muted-foreground">{getCategoryLabel(product.category)}</p>
                        </>
                      )}
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Preço</label>
                      <Input type="number" value={product.price} onChange={(event) => isCustomProduct ? updateCustomProduct(product.id, { price: Number(event.target.value || 0) }) : updateProductAdmin(product.id, { price: Number(event.target.value || 0) })} className="h-11 rounded-2xl border-white/10 bg-card/70" />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">De</label>
                      <Input type="number" value={product.compareAtPrice ?? 0} onChange={(event) => isCustomProduct ? updateCustomProduct(product.id, { compareAtPrice: Number(event.target.value || 0) || undefined }) : updateProductAdmin(product.id, { compareAtPrice: Number(event.target.value || 0) || undefined })} className="h-11 rounded-2xl border-white/10 bg-card/70" />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Estoque</label>
                      <Input type="number" value={product.stockQuantity ?? 0} onChange={(event) => isCustomProduct ? updateCustomProduct(product.id, { stockQuantity: Number(event.target.value || 0) }) : updateProductAdmin(product.id, { stockQuantity: Number(event.target.value || 0) })} className="h-11 rounded-2xl border-white/10 bg-card/70" />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Badge</label>
                      <Input value={product.badge ?? ""} onChange={(event) => isCustomProduct ? updateCustomProduct(product.id, { badge: event.target.value }) : updateProductAdmin(product.id, { badge: event.target.value })} className="h-11 rounded-2xl border-white/10 bg-card/70" />
                    </div>

                    <div className="flex flex-col justify-end gap-2">
                      <Button type="button" variant={product.featured ? "cta" : "ctaOutline"} className="rounded-2xl" onClick={() => isCustomProduct ? updateCustomProduct(product.id, { featured: !product.featured }) : updateProductAdmin(product.id, { featured: !product.featured })}>
                        {product.featured ? "Em destaque" : "Destacar produto"}
                      </Button>
                    </div>

                    <div className="flex flex-col justify-end gap-2">
                      <Button type="button" variant={product.active === false ? "ctaOutline" : "cta"} className="rounded-2xl" onClick={() => isCustomProduct ? updateCustomProduct(product.id, { active: product.active === false ? true : false }) : updateProductAdmin(product.id, { active: product.active === false ? true : false })}>
                        {product.active === false ? "Reativar" : "Ocultar"}
                      </Button>
                    </div>
                  </div>

                  {isCustomProduct ? (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Imagem (URL)</label>
                        <Input value={product.image} onChange={(event) => updateCustomProduct(product.id, { image: event.target.value })} className="h-11 rounded-2xl border-white/10 bg-card/70" />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Destaque curto</label>
                        <Input value={product.highlight} onChange={(event) => updateCustomProduct(product.id, { highlight: event.target.value })} className="h-11 rounded-2xl border-white/10 bg-card/70" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Descrição</label>
                        <Input value={product.description} onChange={(event) => updateCustomProduct(product.id, { description: event.target.value })} className="h-11 rounded-2xl border-white/10 bg-card/70" />
                      </div>
                    </div>
                  ) : null}

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {isCustomProduct ? "Produto criado no painel" : "Produto base da loja"}
                    </p>
                    <Button type="button" variant="ctaOutline" className="rounded-2xl border-red-400/30 text-red-200 hover:bg-red-500/10" onClick={() => void handleDeleteProduct(product)}>
                      <Trash2 className="h-4 w-4" />
                      Excluir produto
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14 md:py-18">
        <div className="container">
          <SectionHeading
            eyebrow="clientes"
            title="Gestão de clientes"
            description="Cadastros e pedidos alimentam esta lista automaticamente. Use este espaço para status e observações."
          />

          <div className="mt-8 grid gap-4">
            {managedUsers.length ? (
              managedUsers.map((user) => (
                <div key={user.id} className="rounded-[28px] border border-white/10 bg-card/75 p-5">
                  <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr_1fr_1.2fr]">
                    <div>
                      <p className="font-display text-xl font-semibold text-foreground">{user.name || "Cliente sem nome"}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {user.email || "Sem e-mail"} • {user.phone || "Sem telefone"}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {user.city || "-"}/{user.state || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Pedidos</p>
                      <p className="mt-2 font-display text-2xl text-foreground">{user.orderCount}</p>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total</p>
                      <p className="mt-2 font-display text-2xl text-foreground">{formatCurrency(user.totalSpent)}</p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Status</label>
                      <select
                        value={user.status}
                        onChange={(event) => updateManagedUser(user.id, { status: event.target.value as never })}
                        className="h-11 w-full rounded-2xl border border-white/10 bg-background/55 px-3 text-sm text-foreground outline-none"
                      >
                        <option value="ativo">Ativo</option>
                        <option value="vip">VIP</option>
                        <option value="bloqueado">Bloqueado</option>
                      </select>
                    </div>

                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Atualizado</p>
                      <p className="mt-2 text-sm text-foreground">
                        {new Date(user.updatedAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div>
                      <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        Observações
                      </label>
                      <Input
                        value={user.notes}
                        onChange={(event) => updateManagedUser(user.id, { notes: event.target.value })}
                        className="h-11 rounded-2xl border-white/10 bg-background/55"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[28px] border border-dashed border-white/15 bg-background/55 p-8 text-center text-muted-foreground">
                Nenhum cliente salvo ainda. Cadastros e pedidos alimentam esta lista automaticamente.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Admin;
