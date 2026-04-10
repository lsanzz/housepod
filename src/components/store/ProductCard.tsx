import { Heart, ShoppingCart } from "lucide-react";
import { toast } from "sonner";
import { Product, formatCurrency, getCategoryLabel } from "@/data/store";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useStore } from "@/context/StoreContext";

interface ProductCardProps { product: Product; }

const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, favorites, toggleFavorite } = useStore();
  const isFavorite = favorites.includes(product.id);
  const outOfStock = (product.stockQuantity ?? 0) <= 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/10 bg-card/80 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_30px_80px_-40px_hsl(var(--primary)/0.9)]">
      <div className="relative overflow-hidden border-b border-white/10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.18),_transparent_58%)] px-5 py-5">
        <button type="button" onClick={() => { toggleFavorite(product.id); toast.success(isFavorite ? "Removido dos favoritos." : "Adicionado aos favoritos."); }} className={cn("absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border transition", isFavorite ? "border-primary/40 bg-primary text-primary-foreground" : "border-white/10 bg-background/80 text-muted-foreground hover:border-primary/30 hover:text-primary")}>
          <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </button>
        {product.badge ? <Badge className="mb-4 rounded-full bg-secondary/15 px-3 py-1 text-[11px] uppercase tracking-[0.22em] text-secondary hover:bg-secondary/15">{product.badge}</Badge> : null}
        <div className="flex min-h-[240px] items-center justify-center rounded-3xl border border-white/5 bg-background/30 p-4">
          <img src={product.image} alt={product.name} className="h-52 w-full object-contain transition duration-500 group-hover:scale-105" loading="lazy" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary/90">{getCategoryLabel(product.category)}</p>
          <h3 className="font-display text-xl font-semibold leading-tight text-foreground">{product.name}</h3>
          <p className="text-sm leading-6 text-muted-foreground">{product.description}</p>
        </div>
        <div className="rounded-2xl border border-white/8 bg-background/45 p-4">
          <p className="text-sm font-medium text-foreground/90">{product.highlight}</p>
          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">{product.stock} • {product.stockQuantity ?? 0} un.</p>
        </div>
        <div className="mt-auto space-y-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-display text-3xl font-semibold text-foreground">{formatCurrency(product.price)}</span>
              {product.compareAtPrice ? <span className="text-sm text-muted-foreground line-through">{formatCurrency(product.compareAtPrice)}</span> : null}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">até {product.installment}</p>
          </div>
          <Button variant="cta" className="w-full rounded-xl py-6 text-sm font-semibold" disabled={outOfStock} onClick={() => { addToCart(product.id, 1); if (!outOfStock) toast.success(`${product.name} adicionado ao carrinho.`); }}>
            <ShoppingCart className="h-4 w-4" />
            {outOfStock ? "Sem estoque" : "Adicionar ao carrinho"}
          </Button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
