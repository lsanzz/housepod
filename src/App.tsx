import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { StoreProvider } from "@/context/StoreContext";
import StoreLayout from "@/layouts/StoreLayout";
import Admin from "@/pages/Admin";
import Clientes from "@/pages/Clientes";
import Checkout from "@/pages/Checkout";
import Entrega from "@/pages/Entrega";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Sobre from "@/pages/Sobre";
import Vendas from "@/pages/Vendas";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <StoreProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Index />} />
              <Route path="/vendas" element={<Vendas />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/entrega" element={<Entrega />} />
              <Route path="/clientes" element={<Clientes />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admgerencia" element={<Admin />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </StoreProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
