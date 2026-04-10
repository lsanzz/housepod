import { Box, Droplets, Flame, PackageSearch, Sparkles, Truck } from "lucide-react";
import heroPod from "@/assets/hero-pod.png";
import productMint from "@/assets/product-mint.png";
import productBerry from "@/assets/product-berry.png";
import productMango from "@/assets/product-mango.png";
import productWatermelon from "@/assets/product-watermelon.png";

export const storeConfig = {
  name: "House Headshop",
  whatsappNumber: "5511999990000",
  whatsappDisplay: "(11) 99999-0000",
  timezone: "America/Sao_Paulo",
  businessHours: {
    mondayToFriday: { open: "09:00", close: "19:00" },
    saturday: { open: "09:00", close: "15:00" },
    sundayClosed: true,
  },
} as const;

export interface AdminSettings {
  accessPin: string;
  availabilityMode: "manual" | "schedule";
  manualOpen: boolean;
  manualMessage: string;
  storeName: string;
  whatsappNumber: string;
  whatsappDisplay: string;
  freeShippingThreshold: number;
  highlightMessage: string;
}

export interface ProductAdminOverride {
  stockQuantity?: number;
  price?: number;
  compareAtPrice?: number;
  active?: boolean;
  featured?: boolean;
  badge?: string;
}

export interface CustomProductInput {
  id: string;
  name: string;
  category: Exclude<Category, "Todos">;
  price: number;
  compareAtPrice?: number;
  image: string;
  badge?: string;
  description: string;
  highlight: string;
  stockQuantity: number;
  active?: boolean;
  featured?: boolean;
}

export interface ManagedUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  orderCount: number;
  totalSpent: number;
  status: "ativo" | "vip" | "bloqueado";
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export const defaultAdminSettings: AdminSettings = {
  accessPin: "1234",
  availabilityMode: "manual",
  manualOpen: true,
  manualMessage: "Atendimento disponível agora pelo WhatsApp.",
  storeName: storeConfig.name,
  whatsappNumber: storeConfig.whatsappNumber,
  whatsappDisplay: storeConfig.whatsappDisplay,
  freeShippingThreshold: 299,
  highlightMessage: "Frete grátis acima de R$ 299",
};

function getZonedDateParts(date = new Date(), timeZone = storeConfig.timezone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    hour12: false,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  };

  return {
    weekday: weekdayMap[values.weekday] ?? date.getDay(),
    hour: Number(values.hour ?? 0),
    minute: Number(values.minute ?? 0),
  };
}

function toMinutes(time: string) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

function formatHourLabel(time: string) {
  return time.replace(":", "h");
}

export function getStoreStatus(date = new Date(), adminSettings: AdminSettings = defaultAdminSettings) {
  if (adminSettings.availabilityMode === "manual") {
    return {
      isOpen: adminSettings.manualOpen,
      label: adminSettings.manualOpen ? "Loja aberta" : "Loja fechada",
      shortLabel: adminSettings.manualOpen ? "Aberta agora" : "Fechada agora",
      description: adminSettings.manualMessage,
      scheduleLabel: adminSettings.manualOpen ? "Atendimento manual ativo" : "Atendimento pausado manualmente",
    };
  }

  const { weekday, hour, minute } = getZonedDateParts(date);
  const currentMinutes = hour * 60 + minute;
  const weekHours = storeConfig.businessHours;

  let openTime: string | null = null;
  let closeTime: string | null = null;

  if (weekday >= 1 && weekday <= 5) {
    openTime = weekHours.mondayToFriday.open;
    closeTime = weekHours.mondayToFriday.close;
  } else if (weekday === 6) {
    openTime = weekHours.saturday.open;
    closeTime = weekHours.saturday.close;
  }

  const isOpen = Boolean(
    openTime && closeTime && currentMinutes >= toMinutes(openTime) && currentMinutes < toMinutes(closeTime),
  );

  const scheduleLabel = `Seg a sex ${formatHourLabel(weekHours.mondayToFriday.open)} às ${formatHourLabel(weekHours.mondayToFriday.close)} • Sáb ${formatHourLabel(weekHours.saturday.open)} às ${formatHourLabel(weekHours.saturday.close)}`;

  if (isOpen && openTime && closeTime) {
    return {
      isOpen: true,
      label: "Loja aberta",
      shortLabel: "Aberta agora",
      description: `Atendimento online até ${formatHourLabel(closeTime)} de hoje.`,
      scheduleLabel,
    };
  }

  if (weekday === 0) {
    return {
      isOpen: false,
      label: "Loja fechada",
      shortLabel: "Fechada agora",
      description: `Hoje o atendimento está encerrado. Retornamos na segunda às ${formatHourLabel(weekHours.mondayToFriday.open)}.`,
      scheduleLabel,
    };
  }

  if (openTime && currentMinutes < toMinutes(openTime)) {
    return {
      isOpen: false,
      label: "Loja fechada",
      shortLabel: "Fechada agora",
      description: `Abrimos hoje às ${formatHourLabel(openTime)}.`,
      scheduleLabel,
    };
  }

  if (weekday >= 1 && weekday <= 4) {
    return {
      isOpen: false,
      label: "Loja fechada",
      shortLabel: "Fechada agora",
      description: `Voltamos amanhã às ${formatHourLabel(weekHours.mondayToFriday.open)}.`,
      scheduleLabel,
    };
  }

  if (weekday === 5) {
    return {
      isOpen: false,
      label: "Loja fechada",
      shortLabel: "Fechada agora",
      description: `Voltamos no sábado às ${formatHourLabel(weekHours.saturday.open)}.`,
      scheduleLabel,
    };
  }

  return {
    isOpen: false,
    label: "Loja fechada",
    shortLabel: "Fechada agora",
    description: `Voltamos na segunda às ${formatHourLabel(weekHours.mondayToFriday.open)}.`,
    scheduleLabel,
  };
}

export interface Product {
  id: string;
  name: string;
  category: Exclude<Category, "Todos">;
  price: number;
  compareAtPrice?: number;
  installment: string;
  image: string;
  badge?: string;
  description: string;
  highlight: string;
  stock: string;
  featured?: boolean;
  stockQuantity?: number;
  active?: boolean;
  source?: "base" | "custom";
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface CustomerProfile {
  name: string;
  email: string;
  phone: string;
  cpf: string;
  cep: string;
  address: string;
  number: string;
  complement: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface ShippingOption {
  id: string;
  label: string;
  price: number;
  eta: string;
  description: string;
  featured?: boolean;
}

export interface OrderRecord {
  id: string;
  createdAt: string;
  status: string;
  paymentMethod: string;
  shippingMethod: string;
  shippingEta: string;
  shippingPrice: number;
  subtotal: number;
  total: number;
  customer: CustomerProfile;
  items: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export const paymentLabels = {
  pix: "PIX",
  card: "Cartão de crédito",
  boleto: "Boleto bancário",
};

export function buildOrderWhatsAppMessage(order: OrderRecord, adminSettings: AdminSettings = defaultAdminSettings) {
  const lines = [
    `*Novo pedido ${order.id}*`,
    "",
    `*Loja:* ${adminSettings.storeName}`,
    "",
    "*Cliente*",
    `${order.customer.name}`,
    `Telefone: ${order.customer.phone}`,
    `E-mail: ${order.customer.email}`,
    order.customer.cpf ? `CPF: ${order.customer.cpf}` : null,
    "",
    "*Entrega*",
    `CEP: ${order.customer.cep}`,
    `Endereço: ${order.customer.address}, ${order.customer.number}`,
    order.customer.complement ? `Complemento: ${order.customer.complement}` : null,
    order.customer.neighborhood ? `Bairro: ${order.customer.neighborhood}` : null,
    `Cidade/UF: ${order.customer.city} - ${order.customer.state}`,
    `Frete: ${order.shippingMethod} (${formatCurrency(order.shippingPrice)})`,
    `Prazo: ${order.shippingEta}`,
    "",
    "*Itens*",
    ...order.items.map((item) => `- ${item.quantity}x ${item.name} - ${formatCurrency(item.price)} cada`),
    "",
    `Subtotal: ${formatCurrency(order.subtotal)}`,
    `Total: ${formatCurrency(order.total)}`,
    `Pagamento: ${paymentLabels[order.paymentMethod as keyof typeof paymentLabels] ?? order.paymentMethod}`,
    `Status do pedido: ${order.status}`,
    "",
    "Pedido enviado pela loja online.",
  ].filter(Boolean);

  return lines.join("\n");
}

export function getWhatsAppOrderUrl(order: OrderRecord, adminSettings: AdminSettings = defaultAdminSettings) {
  return `https://wa.me/${adminSettings.whatsappNumber}?text=${encodeURIComponent(buildOrderWhatsAppMessage(order, adminSettings))}`;
}

export const categories = [
  "Todos",
  "Pods Descartaveis",
  "Refis Descartaveis",
  "Pod System",
  "Nic Salts",
  "Acessorios",
] as const;

export type Category = (typeof categories)[number];

export const categoryDisplayLabels: Record<Category, string> = {
  Todos: "Todos",
  "Pods Descartaveis": "Pods Descartáveis",
  "Refis Descartaveis": "Refis Descartáveis",
  "Pod System": "Pod System",
  "Nic Salts": "Nic Salts",
  Acessorios: "Acessórios",
};

export function getCategoryLabel(category: Category | string) {
  return categoryDisplayLabels[category as Category] ?? category;
}



export const placeholderProductImage = heroPod;

export function buildInstallmentLabel(value: number) {
  const installmentValue = Math.max(value, 0) / 12;
  return `12x de ${formatCurrency(installmentValue)}`;
}

export function slugifyProductId(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") || `produto-${Date.now()}`;
}

export function buildProductFromInput(input: CustomProductInput): Product {
  const stockQuantity = Number.isFinite(input.stockQuantity) ? Math.max(0, input.stockQuantity) : 0;
  return {
    id: input.id,
    name: input.name.trim(),
    category: input.category,
    price: Number(input.price) || 0,
    compareAtPrice: input.compareAtPrice ? Number(input.compareAtPrice) : undefined,
    installment: buildInstallmentLabel(Number(input.price) || 0),
    image: input.image?.trim() || placeholderProductImage,
    badge: input.badge?.trim() || undefined,
    description: input.description.trim(),
    highlight: input.highlight.trim(),
    stock: getStockLabel(stockQuantity),
    stockQuantity,
    active: input.active ?? true,
    featured: input.featured ?? false,
    source: "custom",
  };
}

export const emptyCustomerProfile: CustomerProfile = {
  name: "",
  email: "",
  phone: "",
  cpf: "",
  cep: "",
  address: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
};

export const baseProducts: Product[] = [
  {
    id: "volt-icy-mint",
    name: "House Volt Icy Mint",
    category: "Pods Descartaveis",
    price: 79.9,
    compareAtPrice: 99.9,
    installment: "12x de R$ 8,14",
    image: productMint,
    badge: "Mais vendido",
    description: "Mentol intenso com puxada macia e sensação gelada do início ao fim.",
    highlight: "10.000 puffs | refrescância marcante",
    stock: "Em estoque",
    stockQuantity: 18,
    active: true,
    featured: true,
  },
  {
    id: "volt-berry-rush",
    name: "House Volt Berry Rush",
    category: "Pods Descartaveis",
    price: 82.9,
    compareAtPrice: 97.9,
    installment: "12x de R$ 8,44",
    image: productBerry,
    badge: "Novidade",
    description: "Blend de frutas vermelhas com final gelado e aroma encorpado.",
    highlight: "Frutado doce com toque ice",
    stock: "Em estoque",
    stockQuantity: 14,
    active: true,
    featured: true,
  },
  {
    id: "volt-mango-wave",
    name: "House Volt Mango Wave",
    category: "Pods Descartaveis",
    price: 79.9,
    compareAtPrice: 89.9,
    installment: "12x de R$ 8,14",
    image: productMango,
    badge: "Oferta",
    description: "Manga tropical equilibrada, vapor consistente e final suave.",
    highlight: "Manga gelada queridinha da loja",
    stock: "Em estoque",
    stockQuantity: 10,
    active: true,
    featured: true,
  },
  {
    id: "volt-watermelon-x",
    name: "House Volt Watermelon X",
    category: "Pods Descartaveis",
    price: 84.9,
    installment: "12x de R$ 8,65",
    image: productWatermelon,
    description: "Melancia gelada com perfil leve, doce e muito refrescante.",
    highlight: "Refrescante e adocicado",
    stock: "Últimas unidades",
    stockQuantity: 4,
    active: true,
    featured: true,
  },
  {
    id: "neo-system-carbon",
    name: "House Neo System Carbon",
    category: "Pod System",
    price: 149.9,
    compareAtPrice: 179.9,
    installment: "12x de R$ 15,27",
    image: heroPod,
    badge: "Premium",
    description: "Pod system recarregável com acabamento premium e ótima autonomia.",
    highlight: "Bateria duradoura para o dia todo",
    stock: "Em estoque",
    stockQuantity: 8,
    active: true,
    featured: true,
  },
  {
    id: "neo-refil-mint",
    name: "Refil House Neo Mint",
    category: "Refis Descartaveis",
    price: 59.9,
    compareAtPrice: 69.9,
    installment: "10x de R$ 6,10",
    image: productMint,
    description: "Refil compatível com a linha Neo para reposição prática e sem sujeira.",
    highlight: "Troca rápida e sabor estável",
    stock: "Em estoque",
    stockQuantity: 21,
    active: true,
    featured: true,
  },
  {
    id: "neo-refil-berry",
    name: "Refil House Neo Berry",
    category: "Refis Descartaveis",
    price: 59.9,
    installment: "10x de R$ 6,10",
    image: productBerry,
    description: "Refil frutado intenso com ótima definição de sabor do começo ao fim.",
    highlight: "Desenvolvido para a linha Neo",
    stock: "Em estoque",
    stockQuantity: 16,
    active: true,
  },
  {
    id: "salt-purple-cloud",
    name: "Nic Salt Purple Cloud 30ml",
    category: "Nic Salts",
    price: 64.9,
    compareAtPrice: 74.9,
    installment: "12x de R$ 6,61",
    image: productBerry,
    badge: "20% OFF",
    description: "Nic salt para setups compactos com perfil doce, gelado e equilibrado.",
    highlight: "30ml | 35mg",
    stock: "Em estoque",
    stockQuantity: 12,
    active: true,
  },
  {
    id: "salt-mango-burst",
    name: "Nic Salt Mango Burst 30ml",
    category: "Nic Salts",
    price: 64.9,
    installment: "12x de R$ 6,61",
    image: productMango,
    description: "Blend tropical encorpado para quem gosta de sabor marcante.",
    highlight: "30ml | 50mg",
    stock: "Em estoque",
    stockQuantity: 9,
    active: true,
  },
  {
    id: "coil-xpro-08",
    name: "Coil X-Pro 0.8 Mesh",
    category: "Acessorios",
    price: 35,
    installment: "8x de R$ 5,10",
    image: heroPod,
    description: "Resistência mesh para aquecimento uniforme e mais definição de sabor.",
    highlight: "Compatível com House Neo",
    stock: "Em estoque",
    stockQuantity: 27,
    active: true,
  },
  {
    id: "coil-xpro-10",
    name: "Coil X-Pro 1.0 Mesh",
    category: "Acessorios",
    price: 35,
    compareAtPrice: 39.9,
    installment: "8x de R$ 5,10",
    image: heroPod,
    description: "Ideal para tragada mais fechada e consumo equilibrado de líquido.",
    highlight: "Reposição pronta para envio",
    stock: "Em estoque",
    stockQuantity: 22,
    active: true,
  },
  {
    id: "starter-kit-house",
    name: "Starter Kit House Prime",
    category: "Acessorios",
    price: 199.9,
    compareAtPrice: 239.9,
    installment: "12x de R$ 20,38",
    image: heroPod,
    badge: "Kit completo",
    description: "Kit com dispositivo, refis, case e cabo para começar com tudo.",
    highlight: "Ótimo para presentear ou revender",
    stock: "Em estoque",
    stockQuantity: 6,
    active: true,
    featured: true,
  },
];

export function getStockLabel(stockQuantity = 0) {
  if (stockQuantity <= 0) return "Sem estoque";
  if (stockQuantity <= 4) return "Últimas unidades";
  return "Em estoque";
}

export const storeHighlights = [
  {
    title: "Frete inteligente",
    description: "Simulação por região com opções econômica, expressa e frete grátis.",
    icon: Truck,
  },
  {
    title: "Catálogo bem organizado",
    description: "Vitrine com destaques, lançamentos e categorias fáceis de navegar.",
    icon: PackageSearch,
  },
  {
    title: "Área do cliente",
    description: "Cadastro salvo, favoritos e histórico de pedidos no mesmo lugar.",
    icon: Sparkles,
  },
  {
    title: "Fechamento rápido",
    description: "Carrinho, entrega e pagamento em um fluxo simples e direto.",
    icon: Box,
  },
];

export const homeHighlights = [
  { label: "Clientes atendidos", value: "+3.200" },
  { label: "Pedidos enviados", value: "+8.400" },
  { label: "Avaliações", value: "4,9/5" },
];

export const aboutStats = [
  { label: "Categorias", value: "6" },
  { label: "Destaques", value: "12" },
  { label: "Suporte", value: "Seg a sáb" },
  { label: "Envio", value: "24h úteis" },
];

export const whyChooseUs = [
  {
    title: "Curadoria de sabores",
    description: "Seleção pensada para quem busca variedade entre frutados, gelados e opções clássicas.",
    icon: PackageSearch,
  },
  {
    title: "Experiência de compra fluida",
    description: "Busca, filtros, favoritos e checkout deixam a navegação rápida e intuitiva.",
    icon: Flame,
  },
  {
    title: "Atendimento próximo",
    description: "Resumo de pedido, WhatsApp e área do cliente facilitam o pós-compra.",
    icon: Droplets,
  },
];

export const loyaltyPerks = [
  "Cadastre seu e-mail para receber ofertas e lançamentos em primeira mão.",
  "Salve produtos favoritos e volte para finalizar quando quiser.",
  "Mantenha seus dados salvos para comprar de novo com mais rapidez.",
];

export const testimonials = [
  {
    name: "Lucas M.",
    role: "Cliente recorrente",
    text: "Os sabores chegam sempre bem embalados e o site é fácil de navegar.",
  },
  {
    name: "Bianca R.",
    role: "Primeira compra",
    text: "Gostei da clareza no frete e no resumo do pedido. Passa bastante confiança.",
  },
  {
    name: "Rafael S.",
    role: "Compra no PIX",
    text: "Fechei o pedido rápido e o atendimento no WhatsApp agilizou tudo.",
  },
];

export const faqItems = [
  {
    question: "Qual é o prazo de envio?",
    answer: "Pedidos aprovados entram em separação em até 24 horas úteis e seguem com rastreio.",
  },
  {
    question: "Tem frete grátis?",
    answer: "Sim. A modalidade gratuita é liberada automaticamente para pedidos a partir de R$ 299,00 nas regiões atendidas.",
  },
  {
    question: "Consigo acompanhar meus pedidos?",
    answer: "Sim. A área do cliente reúne os pedidos realizados e mostra o status de cada compra.",
  },
  {
    question: "Quais formas de pagamento estão disponíveis?",
    answer: "Você pode concluir pelo PIX, cartão ou boleto dentro do fluxo de compra.",
  },
  {
    question: "Como funciona o cadastro do cliente?",
    answer: "Você pode salvar dados pessoais, endereço e favoritos para agilizar as próximas compras.",
  },
];

export const stateOptions = [
  "SP",
  "RJ",
  "MG",
  "ES",
  "PR",
  "SC",
  "RS",
  "BA",
  "GO",
  "DF",
  "PE",
  "CE",
  "PA",
  "AM",
];

export function getShippingOptions(state = "SP", subtotal = 0, freeShippingThreshold = defaultAdminSettings.freeShippingThreshold): ShippingOption[] {
  const regionalMultiplier = ["SP", "RJ", "MG", "ES", "PR", "SC"].includes(state) ? 1 : 1.25;
  const options: ShippingOption[] = [
    {
      id: "standard",
      label: "Frete padrão",
      price: Number((18.9 * regionalMultiplier).toFixed(2)),
      eta: regionalMultiplier === 1 ? "3 a 5 dias úteis" : "5 a 8 dias úteis",
      description: "Envio rastreado com ótimo custo-benefício para a maioria dos pedidos.",
    },
    {
      id: "express",
      label: "Frete expresso",
      price: Number((29.9 * regionalMultiplier).toFixed(2)),
      eta: regionalMultiplier === 1 ? "1 a 2 dias úteis" : "2 a 4 dias úteis",
      description: "Entrega prioritária para quem quer receber mais rápido.",
      featured: true,
    },
  ];

  if (subtotal >= freeShippingThreshold) {
    options.unshift({
      id: "free",
      label: "Frete grátis",
      price: 0,
      eta: regionalMultiplier === 1 ? "4 a 6 dias úteis" : "6 a 10 dias úteis",
      description: `Frete liberado automaticamente para compras acima de ${formatCurrency(freeShippingThreshold)}.`,
    });
  }

  return options;
}
