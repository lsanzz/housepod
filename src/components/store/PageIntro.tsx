import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageIntroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  aside?: ReactNode;
  compact?: boolean;
}

const PageIntro = ({
  eyebrow,
  title,
  description,
  actions,
  aside,
  compact = false,
}: PageIntroProps) => {
  return (
    <section className="relative overflow-hidden border-b border-white/10 pb-12 pt-10 md:pb-16 md:pt-14">
      <div className="container grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className={cn("space-y-6", compact && "max-w-3xl")}> 
          <span className="inline-flex rounded-full border border-secondary/30 bg-secondary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-secondary">
            {eyebrow}
          </span>
          <div className="space-y-4">
            <h1 className="font-display text-4xl font-semibold tracking-tight text-foreground md:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-3xl text-base leading-7 text-muted-foreground md:text-lg">
              {description}
            </p>
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>

        {aside ? <div className="relative">{aside}</div> : null}
      </div>
    </section>
  );
};

export default PageIntro;
