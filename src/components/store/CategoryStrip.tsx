import { Link } from "react-router-dom";
import { BatteryCharging, Droplets, Flame, PackageSearch, Repeat, ShieldCheck } from "lucide-react";
import { categories, getCategoryLabel } from "@/data/store";

const iconByCategory = {
  Todos: PackageSearch,
  "Pods Descartaveis": Flame,
  "Refis Descartaveis": Repeat,
  "Pod System": BatteryCharging,
  "Nic Salts": Droplets,
  Acessorios: ShieldCheck,
};

const CategoryStrip = () => {
  return (
    <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
      {categories
        .filter((category) => category !== "Todos")
        .map((category) => {
          const Icon = iconByCategory[category];
          return (
            <Link
              key={category}
              to={`/vendas?categoria=${encodeURIComponent(category)}`}
              className="group rounded-2xl border border-white/10 bg-card/70 p-4 transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:bg-card"
            >
              <div className="mb-4 inline-flex rounded-xl bg-primary/12 p-3 text-primary transition duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <p className="font-display text-lg font-semibold text-foreground">{getCategoryLabel(category)}</p>
              <p className="mt-1 text-sm text-muted-foreground">Ver opções</p>
            </Link>
          );
        })}
    </div>
  );
};

export default CategoryStrip;
