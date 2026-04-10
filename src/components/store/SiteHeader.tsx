import { FormEvent, useEffect, useMemo, useState } from "react";
import { Clock3, Heart, Menu, MessageCircle, Package, Search, ShoppingBag, Store, UserRound, X } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";
import { getStoreStatus } from "@/data/store";

const navigation = [
  { label: "Início", to: "/" },
  { label: "Catálogo", to: "/vendas" },
  { label: "Sobre", to: "/sobre" },
  { label: "Entrega", to: "/entrega" },
  { label: "Clientes", to: "/clientes" },
];

const SiteHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { cartCount, favorites, orders, adminSettings } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [storeStatus, setStoreStatus] = useState(() => getStoreStatus(new Date(), adminSettings));

  useEffect(() => {
    setSearch(searchParams.get("busca") ?? "");
  }, [searchParams]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const updateStatus = () => setStoreStatus(getStoreStatus(new Date(), adminSettings));
    updateStatus();
    const timer = window.setInterval(updateStatus, 60000);
    return () => window.clearInterval(timer);
  }, [adminSettings]);

  const quickItems = useMemo(
    () => [
      { label: "Minha área", to: "/clientes", icon: UserRound, count: undefined },
      { label: "Pedidos", to: "/clientes", icon: Package, count: orders.length || undefined },
      { label: "Favoritos", to: "/clientes", icon: Heart, count: favorites.length || undefined },
      { label: "Carrinho", to: "/checkout", icon: ShoppingBag, count: cartCount || undefined },
    ],
    [cartCount, favorites.length, orders.length],
  );

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmed = search.trim();
    if (trimmed) params.set("busca", trimmed);
    navigate(`/vendas${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-background/88 backdrop-blur-xl">
      <div className="border-b border-white/10 bg-card/75">
        <div className="container flex flex-col gap-3 py-3 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              {adminSettings.highlightMessage}
            </span>
            <span className="hidden md:inline">Catálogo online com envio rápido e atendimento direto no WhatsApp</span>
          </div>

          <div className="flex flex-wrap gap-4 text-xs md:text-sm">
            <a href={`https://wa.me/${adminSettings.whatsappNumber}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 hover:text-foreground">
              <MessageCircle className="h-3.5 w-3.5" />
              <span>WhatsApp: {adminSettings.whatsappDisplay}</span>
            </a>
            <span className={`inline-flex items-center gap-2 font-medium ${storeStatus.isOpen ? "text-emerald-300" : "text-amber-300"}`}>
              {storeStatus.isOpen ? <Store className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
              {storeStatus.shortLabel}
            </span>
            <span className="font-medium text-foreground">18+ venda exclusiva para maiores de idade</span>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <div className="grid gap-4 lg:grid-cols-[220px_1fr_auto] lg:items-center">
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,hsl(var(--primary)),hsl(var(--secondary)))] text-base font-bold text-primary-foreground shadow-[0_20px_40px_-24px_hsl(var(--primary)/0.95)]">
                HH
              </div>
              <div>
                <p className="font-display text-lg font-semibold tracking-tight text-foreground">{adminSettings.storeName.toUpperCase()}</p>
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">A melhor do momento!</p>
              </div>
            </Link>

            <button type="button" className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-foreground lg:hidden" onClick={() => setMobileOpen((previous) => !previous)}>
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          <form onSubmit={handleSearch} className="hidden lg:block">
            <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-card/80 p-2">
              <Search className="ml-2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Busque pods, refis, nic salts e acessórios" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" />
              <Button type="submit" variant="cta" className="rounded-xl px-5">Buscar</Button>
            </div>
          </form>

          <div className="hidden items-center justify-end gap-2 lg:flex">
            {quickItems.map((item) => (
              <Link key={item.label} to={item.to} className="group relative inline-flex min-w-[104px] items-center justify-center gap-2 rounded-2xl border border-white/10 bg-card/70 px-4 py-3 text-sm font-medium text-foreground transition duration-300 hover:border-primary/30 hover:bg-card">
                <item.icon className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                <span>{item.label}</span>
                {item.count ? <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">{item.count}</span> : null}
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-4 hidden items-center justify-between gap-6 rounded-2xl border border-white/10 bg-card/60 px-4 py-3 lg:flex">
          <nav className="flex flex-wrap items-center gap-2">
            {navigation.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link key={item.to} to={item.to} className={cn("rounded-xl px-4 py-2 text-sm font-medium transition duration-200", active ? "bg-primary text-primary-foreground shadow-[0_15px_40px_-24px_hsl(var(--primary)/0.9)]" : "text-muted-foreground hover:bg-white/5 hover:text-foreground")}>{item.label}</Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className={`rounded-full px-3 py-1 ${storeStatus.isOpen ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-300" : "border border-amber-500/20 bg-amber-500/10 text-amber-300"}`}>{storeStatus.label}</span>
            <span>PIX</span>
            <span>Cartão</span>
            <span>{storeStatus.scheduleLabel}</span>
          </div>
        </div>

        {mobileOpen ? (
          <div className="mt-4 space-y-4 rounded-3xl border border-white/10 bg-card/90 p-4 lg:hidden">
            <form onSubmit={handleSearch}>
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-background/70 px-3 py-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar no catálogo" className="border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" />
              </div>
            </form>

            <nav className="grid gap-2">
              {navigation.map((item) => {
                const active = location.pathname === item.to;
                return <Link key={item.to} to={item.to} className={cn("rounded-2xl px-4 py-3 text-sm font-medium transition", active ? "bg-primary text-primary-foreground" : "bg-background/60 text-foreground")}>{item.label}</Link>;
              })}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default SiteHeader;
