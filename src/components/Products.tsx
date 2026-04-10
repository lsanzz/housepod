import { Button } from "@/components/ui/button";
import { ShoppingCart, Flame } from "lucide-react";
import productMint from "@/assets/product-mint.png";
import productBerry from "@/assets/product-berry.png";
import productMango from "@/assets/product-mango.png";
import productWatermelon from "@/assets/product-watermelon.png";

const products = [
  { name: "Ice Mint", price: "R$ 79,90", oldPrice: "R$ 99,90", image: productMint, badge: "Mais vendido" },
  { name: "Berry Fusion", price: "R$ 79,90", oldPrice: null, image: productBerry, badge: null },
  { name: "Mango Tropical", price: "R$ 79,90", oldPrice: "R$ 89,90", image: productMango, badge: "Oferta" },
  { name: "Watermelon Ice", price: "R$ 79,90", oldPrice: null, image: productWatermelon, badge: null },
];

const Products = () => {
  return (
    <section className="py-20 bg-card/30">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-2xl md:text-3xl font-bold text-center mb-4 glow-text">
          PRODUTOS EM ALTA
        </h2>
        <p className="text-muted-foreground text-center mb-12 max-w-xl mx-auto">
          Uma seleção rápida dos sabores que mais saem na House.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p.name} className="glass rounded-xl overflow-hidden card-glow transition-all duration-300 group">
              <div className="relative aspect-square bg-muted/20 flex items-center justify-center p-4">
                {p.badge && (
                  <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full gradient-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                    <Flame className="w-3 h-3" />
                    {p.badge}
                  </span>
                )}
                <img
                  src={p.image}
                  alt={p.name}
                  loading="lazy"
                  width={512}
                  height={512}
                  className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="p-4 space-y-3">
                <h3 className="font-display text-sm font-bold text-foreground">{p.name}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold gradient-text">{p.price}</span>
                  {p.oldPrice && (
                    <span className="text-sm text-muted-foreground line-through">{p.oldPrice}</span>
                  )}
                </div>
                <Button variant="cta" size="sm" className="w-full text-xs">
                  <ShoppingCart className="w-3.5 h-3.5" />
                  Adicionar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Products;
