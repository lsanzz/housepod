import { Button } from "@/components/ui/button";
import { Timer, Percent } from "lucide-react";
import { useState, useEffect } from "react";

const OfferBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds--;
        if (seconds < 0) { seconds = 59; minutes--; }
        if (minutes < 0) { minutes = 59; hours--; }
        if (hours < 0) { hours = 23; minutes = 59; seconds = 59; }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden gradient-primary p-8 md:p-12 text-center glow-primary">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-background/20 px-4 py-2 text-primary-foreground">
              <Percent className="w-5 h-5" />
              <span className="font-bold">OFERTA ESPECIAL DA SEMANA</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-black text-primary-foreground">
              5% OFF NA PRIMEIRA COMPRA
            </h2>
            <p className="text-primary-foreground/80 text-lg max-w-lg mx-auto">
              Use o cupom <span className="font-mono font-bold bg-background/20 px-2 py-1 rounded">HOUSE5</span> ao finalizar o pedido
            </p>

            {/* Countdown */}
            <div className="flex justify-center gap-4 mt-6">
              {[
                { val: pad(timeLeft.hours), label: "Horas" },
                { val: pad(timeLeft.minutes), label: "Min" },
                { val: pad(timeLeft.seconds), label: "Seg" },
              ].map((t) => (
                <div key={t.label} className="bg-background/20 rounded-lg px-4 py-3 min-w-[70px]">
                  <p className="font-display text-2xl md:text-3xl font-bold text-primary-foreground">{t.val}</p>
                  <p className="text-xs text-primary-foreground/70 uppercase">{t.label}</p>
                </div>
              ))}
            </div>

            <Button variant="ctaOutline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary mt-4 text-base px-8 py-6">
              <Timer className="w-5 h-5" />
              Quero aproveitar
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OfferBanner;
