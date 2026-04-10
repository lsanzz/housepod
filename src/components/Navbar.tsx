import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="font-display text-lg font-bold gradient-text">
          HOUSE HEADSHOP
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#produtos" className="text-sm text-muted-foreground hover:text-primary transition-colors">Produtos</a>
          <a href="#sobre" className="text-sm text-muted-foreground hover:text-primary transition-colors">Sobre</a>
          <a href="#faq" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQ</a>
          <Button variant="cta" size="sm">
            <ShoppingCart className="w-4 h-4" />
            Ver ofertas
          </Button>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden glass border-t border-border/30 px-4 py-4 space-y-3 animate-fade-in">
          <a href="#produtos" className="block text-sm text-muted-foreground hover:text-primary">Produtos</a>
          <a href="#sobre" className="block text-sm text-muted-foreground hover:text-primary">Sobre</a>
          <a href="#faq" className="block text-sm text-muted-foreground hover:text-primary">FAQ</a>
          <Button variant="cta" size="sm" className="w-full">
            <ShoppingCart className="w-4 h-4" />
            Ver ofertas
          </Button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
