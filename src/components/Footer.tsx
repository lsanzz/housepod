import { Instagram, MessageCircle, ShieldAlert } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="font-display text-xl font-bold gradient-text mb-3">HOUSE HEADSHOP</h3>
            <p className="text-sm text-muted-foreground">
              Curadoria premium em pods, refis e acessórios com atendimento rápido e compra sem complicação.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-3">LINKS</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Produtos</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Sobre</li>
              <li className="hover:text-primary transition-colors cursor-pointer">FAQ</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Contato</li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-display text-sm font-bold text-foreground mb-3">REDES SOCIAIS</h4>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:glow-primary transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-lg glass flex items-center justify-center text-muted-foreground hover:text-primary hover:glow-primary transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Legal */}
        <div className="border-t border-border/30 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 House Headshop. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldAlert className="w-4 h-4 text-destructive" />
            <span>Proibida a venda para menores de 18 anos.</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
