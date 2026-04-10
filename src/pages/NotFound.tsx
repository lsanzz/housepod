import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-xl rounded-[36px] border border-white/10 bg-card/75 p-8 text-center md:p-10">
        <span className="inline-flex rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          página não encontrada
        </span>
        <h1 className="mt-6 font-display text-6xl font-semibold text-foreground">404</h1>
        <p className="mt-4 text-base leading-7 text-muted-foreground">
          O caminho <span className="text-foreground">{location.pathname}</span> não existe nesta loja.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="cta" className="rounded-2xl px-6 py-6 text-sm">
            <Link to="/">Voltar ao início</Link>
          </Button>
          <Button asChild variant="ctaOutline" className="rounded-2xl px-6 py-6 text-sm">
            <Link to="/vendas">Ir para o catálogo</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
