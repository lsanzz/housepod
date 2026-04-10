import { SmokeBackground } from "@/components/ui/spooky-smoke-animation";
import { Button } from "@/components/ui/button";
import heroPod from "@/assets/hero-pod.png";
import { ShoppingCart, Sparkles } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      {/* Smoke Background */}
      <div className="absolute inset-0 z-0">
        <SmokeBackground smokeColor="#7B2FBE" />
      </div>
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/40 via-transparent to-background" />

      <div className="relative z-10 container mx-auto px-4 py-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Text */}
        <div className="space-y-6 animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
            <Sparkles className="w-4 h-4" />
            <span>Seleção House</span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
            <span className="gradient-text">SABOR MARCANTE.</span>
            <br />
            <span className="text-foreground">COMPRA RÁPIDA.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-lg leading-relaxed">
            Curadoria de pods, refis e acessórios para quem busca praticidade, visual premium e sabores que entregam uma experiência consistente.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Button variant="cta" size="lg" className="text-base px-8 py-6">
              <ShoppingCart className="w-5 h-5" />
              Comprar agora
            </Button>
            <Button variant="ctaOutline" size="lg" className="text-base px-8 py-6">
              Explorar sabores
            </Button>
          </div>
        </div>

        {/* Hero image */}
        <div className="flex justify-center animate-float" style={{ animationDelay: "0.3s" }}>
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-[80px]" />
            <img
              src={heroPod}
              alt="Linha House Headshop"
              width={500}
              height={500}
              className="relative z-10 drop-shadow-2xl max-w-[400px] md:max-w-[500px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
