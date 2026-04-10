import { useMemo, useState } from "react";
import { Filter, Search, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PageIntro from "@/components/store/PageIntro";
import ProductCard from "@/components/store/ProductCard";
import { categories, getCategoryLabel } from "@/data/store";
import { useStore } from "@/context/StoreContext";

const Vendas = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get("categoria") ?? "Todos";
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("featured");
  const [query, setQuery] = useState(searchParams.get("busca") ?? "");
  const { cartCount, favorites, products } = useStore();

  const filteredProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const result = products.filter((product) => {
      const matchesCategory = activeCategory === "Todos" || product.category === activeCategory;
      const matchesQuery = !normalizedQuery || [product.name, product.category, product.description].some((value) => value.toLowerCase().includes(normalizedQuery));
      return matchesCategory && matchesQuery;
    });
    return [...result].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [activeCategory, products, query, sortBy]);

  const applySearchParams = (nextCategory: string, nextQuery: string) => {
    const params = new URLSearchParams();
    if (nextCategory !== "Todos") params.set("categoria", nextCategory);
    if (nextQuery.trim()) params.set("busca", nextQuery.trim());
    setSearchParams(params);
  };

  return <div><PageIntro eyebrow="catálogo" title="Catálogo completo com filtros e busca rápida" description="Encontre pods, refis, nic salts e acessórios com estoque atualizado e navegação simples." actions={<><Button asChild variant="cta" className="rounded-2xl px-6 py-6 text-sm"><Link to="/checkout">Finalizar pedido</Link></Button><Button asChild variant="ctaOutline" className="rounded-2xl px-6 py-6 text-sm"><Link to="/admgerencia">Central da loja</Link></Button></>} aside={<div className="grid gap-4 sm:grid-cols-2"><div className="rounded-[28px] border border-white/10 bg-card/75 p-6"><ShoppingBag className="h-5 w-5 text-primary" /><p className="mt-4 font-display text-3xl font-semibold text-foreground">{cartCount}</p><p className="mt-1 text-sm text-muted-foreground">itens no carrinho</p></div><div className="rounded-[28px] border border-white/10 bg-card/75 p-6"><ShieldCheck className="h-5 w-5 text-primary" /><p className="mt-4 font-display text-3xl font-semibold text-foreground">{favorites.length}</p><p className="mt-1 text-sm text-muted-foreground">favoritos salvos</p></div></div>} />
  <section className="py-12 md:py-16"><div className="container grid gap-8 xl:grid-cols-[1fr_320px]"><div><div className="rounded-[28px] border border-white/10 bg-card/75 p-5 md:p-6"><div className="grid gap-4 lg:grid-cols-[1fr_auto_auto]"><div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => { const value = event.target.value; setQuery(value); applySearchParams(activeCategory, value); }} placeholder="Buscar por nome, categoria ou sabor" className="h-12 rounded-2xl border-white/10 bg-background/60 pl-11" /></div><div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-background/60 p-2 md:grid-cols-3 lg:flex lg:flex-wrap">{categories.map((category) => <button key={category} type="button" onClick={() => { setActiveCategory(category); applySearchParams(category, query); }} className={`rounded-xl px-4 py-2 text-sm font-medium transition ${activeCategory === category ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"}`}>{getCategoryLabel(category)}</button>)}</div><div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-background/60 px-4"><Filter className="h-4 w-4 text-muted-foreground" /><select value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="h-12 w-full bg-transparent text-sm text-foreground outline-none"><option value="featured">Mais relevantes</option><option value="price-asc">Menor preço</option><option value="price-desc">Maior preço</option><option value="name">Nome A-Z</option></select></div></div><div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted-foreground"><p>{filteredProducts.length} produtos encontrados.</p><p>Estoque e disponibilidade são atualizados em tempo real.</p></div></div><div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)}</div></div><aside className="space-y-5 xl:sticky xl:top-36 xl:h-fit"><div className="rounded-[28px] border border-white/10 bg-card/75 p-6"><h2 className="font-display text-2xl font-semibold text-foreground">Por que comprar aqui</h2><div className="mt-5 space-y-4 text-sm text-muted-foreground"><div className="rounded-2xl border border-white/10 bg-background/60 p-4"><p className="font-medium text-foreground">Frete e rastreio</p><p className="mt-2 leading-6">Simulação por estado e prazos organizados na página de entrega.</p></div><div className="rounded-2xl border border-white/10 bg-background/60 p-4"><p className="font-medium text-foreground">Área do cliente</p><p className="mt-2 leading-6">Favoritos, cadastro e histórico de pedidos ficam centralizados em um só lugar.</p></div><div className="rounded-2xl border border-white/10 bg-background/60 p-4"><p className="font-medium text-foreground">Atendimento direto</p><p className="mt-2 leading-6">Resumo do pedido e contato rápido via WhatsApp para agilizar o atendimento.</p></div></div><Button asChild variant="cta" className="mt-6 w-full rounded-2xl py-6 text-sm"><Link to="/checkout">Ir para o carrinho</Link></Button></div><div className="rounded-[28px] border border-white/10 bg-[linear-gradient(135deg,hsl(var(--primary)/0.18),hsl(var(--secondary)/0.12))] p-6"><div className="flex items-center gap-3 text-foreground"><Truck className="h-5 w-5 text-primary" /><p className="font-display text-xl font-semibold">Entrega rápida</p></div><p className="mt-3 text-sm leading-7 text-foreground/80">Consulte prazos, modalidades e a condição de frete grátis antes de fechar o pedido.</p><Button asChild variant="ctaOutline" className="mt-5 rounded-2xl border-white/30 bg-background/10 text-foreground hover:bg-background/20"><Link to="/entrega">Ver opções de frete</Link></Button></div></aside></div></section></div>;
};

export default Vendas;
