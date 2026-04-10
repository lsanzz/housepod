import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import SiteFooter from "@/components/store/SiteFooter";
import SiteHeader from "@/components/store/SiteHeader";

const StoreLayout = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_hsl(var(--primary)/0.14),_transparent_36%),radial-gradient(circle_at_20%_18%,_hsl(var(--secondary)/0.1),_transparent_28%),linear-gradient(180deg,_rgba(7,7,12,1)_0%,_rgba(10,10,16,1)_52%,_rgba(7,7,12,1)_100%)]" />
      <SiteHeader />
      <main className="pb-20">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
};

export default StoreLayout;
