import { createContext, type ReactNode, useContext, useEffect, useMemo, useRef } from "react";
import {
  collection,
  deleteField,
  doc,
  onSnapshot,
  runTransaction,
  setDoc,
  type DocumentData,
} from "firebase/firestore";
import { toast } from "sonner";
import {
  type AdminSettings,
  type CartItem,
  type CustomProductInput,
  type CustomerProfile,
  type ManagedUser,
  type OrderRecord,
  type Product,
  type ProductAdminOverride,
  type ShippingOption,
  baseProducts,
  buildProductFromInput,
  defaultAdminSettings,
  emptyCustomerProfile,
  getStockLabel,
  placeholderProductImage,
  slugifyProductId,
} from "@/data/store";
import { firestoreDb, firebaseReady, realtimeStoreId } from "@/lib/firebase";
import { usePersistentState } from "@/hooks/usePersistentState";

interface DetailedCartItem extends CartItem {
  product: Product;
  lineTotal: number;
}

interface PlaceOrderPayload {
  shippingOption: ShippingOption;
  paymentMethod: string;
  customer: CustomerProfile;
}

interface StoreContextType {
  products: Product[];
  adminSettings: AdminSettings;
  productOverrides: Record<string, ProductAdminOverride>;
  managedUsers: ManagedUser[];
  cart: CartItem[];
  favorites: string[];
  customer: CustomerProfile;
  orders: OrderRecord[];
  customerOrders: OrderRecord[];
  cartItems: DetailedCartItem[];
  cartCount: number;
  cartSubtotal: number;
  favoriteProducts: Product[];
  isRealtimeEnabled: boolean;
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  updateCustomer: (nextValues: Partial<CustomerProfile>) => void;
  placeOrder: (payload: PlaceOrderPayload) => Promise<OrderRecord | null>;
  updateAdminSettings: (nextValues: Partial<AdminSettings>) => void;
  updateProductAdmin: (productId: string, updates: Partial<ProductAdminOverride>) => void;
  addProduct: (product: Omit<CustomProductInput, "id"> & { id?: string }) => Promise<string | null>;
  updateCustomProduct: (productId: string, updates: Partial<Omit<CustomProductInput, "id">>) => void;
  deleteProduct: (productId: string) => Promise<void>;
  updateManagedUser: (userId: string, updates: Partial<ManagedUser>) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

function getStatusByPayment(paymentMethod: string) {
  if (paymentMethod === "pix") return "Aguardando confirmação do PIX";
  if (paymentMethod === "card") return "Pagamento aprovado";
  return "Boleto gerado";
}

function mergeProducts(
  overrides: Record<string, ProductAdminOverride>,
  customProducts: Record<string, Product>,
  deletedProductIds: string[],
) {
  const deletedSet = new Set(deletedProductIds);

  const mergedBaseProducts = baseProducts
    .filter((product) => !deletedSet.has(product.id))
    .map((product) => {
      const override = overrides[product.id] ?? {};
      const stockQuantity = override.stockQuantity ?? product.stockQuantity ?? 0;
      const price = override.price ?? product.price;
      return {
        ...product,
        ...override,
        price,
        installment: product.installment ? product.installment : undefined,
        stockQuantity,
        active: override.active ?? product.active ?? true,
        featured: override.featured ?? product.featured ?? false,
        badge: override.badge === "" ? undefined : override.badge ?? product.badge,
        stock: getStockLabel(stockQuantity),
        source: "base" as const,
      };
    });

  const mergedCustomProducts = Object.values(customProducts).map((product) => ({
    ...product,
    source: "custom" as const,
    stock: getStockLabel(product.stockQuantity ?? 0),
    image: product.image || placeholderProductImage,
  }));

  return [...mergedBaseProducts, ...mergedCustomProducts]
    .filter((product) => product.active !== false);
}

function sortOrders(items: OrderRecord[]) {
  return [...items].sort((left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime());
}

function sortManagedUsers(items: ManagedUser[]) {
  return [...items].sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime());
}

function getCustomerId(customer: CustomerProfile) {
  return customer.email || customer.phone || `${customer.name}-${customer.cep}` || `cliente-${Date.now()}`;
}

function buildManagedUser(existing: ManagedUser | undefined, customer: CustomerProfile, orderTotal?: number): ManagedUser {
  const now = new Date().toISOString();
  return {
    id: existing?.id ?? getCustomerId(customer),
    name: customer.name || existing?.name || "",
    email: customer.email || existing?.email || "",
    phone: customer.phone || existing?.phone || "",
    city: customer.city || existing?.city || "",
    state: customer.state || existing?.state || "",
    orderCount: (existing?.orderCount ?? 0) + (orderTotal ? 1 : 0),
    totalSpent: (existing?.totalSpent ?? 0) + (orderTotal ?? 0),
    status: existing?.status ?? "ativo",
    notes: existing?.notes ?? "",
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
}

function upsertManagedUser(previous: ManagedUser[], customer: CustomerProfile, orderTotal?: number) {
  const customerId = getCustomerId(customer);
  const existing = previous.find((user) => user.id === customerId);
  const nextUser = buildManagedUser(existing, customer, orderTotal);

  if (existing) {
    return previous.map((user) => (user.id === customerId ? nextUser : user));
  }

  return [nextUser, ...previous];
}

function normalizeAdminSettings(data?: Partial<AdminSettings>) {
  return {
    ...defaultAdminSettings,
    ...(data ?? {}),
  };
}

function normalizeCatalogData(data?: DocumentData | null) {
  if (!data) return {
    productOverrides: {},
    customProducts: {},
    deletedProductIds: [],
  };

  return {
    productOverrides:
      typeof data.productOverrides === "object" && data.productOverrides !== null
        ? (data.productOverrides as Record<string, ProductAdminOverride>)
        : {},
    customProducts:
      typeof data.customProducts === "object" && data.customProducts !== null
        ? (data.customProducts as Record<string, Product>)
        : {},
    deletedProductIds: Array.isArray(data.deletedProductIds)
      ? data.deletedProductIds.filter((value): value is string => typeof value === "string")
      : [],
  };
}

function createRemoteManagedUserPayload(user: ManagedUser) {
  return {
    ...user,
    updatedAtMs: new Date(user.updatedAt).getTime(),
    createdAtMs: new Date(user.createdAt).getTime(),
  };
}

function createRemoteOrderPayload(order: OrderRecord) {
  return {
    ...order,
    createdAtMs: new Date(order.createdAt).getTime(),
  };
}

function readManagedUser(data: DocumentData) {
  const { updatedAtMs, createdAtMs, ...rest } = data;
  void updatedAtMs;
  void createdAtMs;
  return rest as ManagedUser;
}

function readOrder(data: DocumentData) {
  const { createdAtMs, ...rest } = data;
  void createdAtMs;
  return rest as OrderRecord;
}

function prepareProductOverrideForRemote(updates: Partial<ProductAdminOverride>) {
  return Object.fromEntries(
    Object.entries(updates).map(([key, value]) => [key, value === undefined ? deleteField() : value]),
  );
}

function getSettingsRef() {
  return doc(firestoreDb!, "stores", realtimeStoreId, "config", "settings");
}

function getCatalogRef() {
  return doc(firestoreDb!, "stores", realtimeStoreId, "config", "catalog");
}

function getCustomersCollectionRef() {
  return collection(firestoreDb!, "stores", realtimeStoreId, "customers");
}

function getOrdersCollectionRef() {
  return collection(firestoreDb!, "stores", realtimeStoreId, "orders");
}

function getCustomerDocRef(customerId: string) {
  return doc(getCustomersCollectionRef(), encodeURIComponent(customerId));
}

function getOrderDocRef(orderId: string) {
  return doc(getOrdersCollectionRef(), orderId);
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistentState<CartItem[]>("house-store-cart", []);
  const [favorites, setFavorites] = usePersistentState<string[]>("house-store-favorites", []);
  const [customer, setCustomer] = usePersistentState<CustomerProfile>("house-store-customer", emptyCustomerProfile);
  const [customerOrders, setCustomerOrders] = usePersistentState<OrderRecord[]>("house-store-customer-orders", []);
  const [orders, setOrders] = usePersistentState<OrderRecord[]>("house-store-orders-cache", []);
  const [adminSettings, setAdminSettings] = usePersistentState<AdminSettings>("house-store-admin-settings-cache", defaultAdminSettings);
  const [productOverrides, setProductOverrides] = usePersistentState<Record<string, ProductAdminOverride>>(
    "house-store-product-overrides-cache",
    {},
  );
  const [customProducts, setCustomProducts] = usePersistentState<Record<string, Product>>("house-store-custom-products-cache", {});
  const [deletedProductIds, setDeletedProductIds] = usePersistentState<string[]>("house-store-deleted-products-cache", []);
  const [managedUsers, setManagedUsers] = usePersistentState<ManagedUser[]>("house-store-managed-users-cache", []);
  const syncErrorShownRef = useRef(false);

  useEffect(() => {
    if (!firebaseReady || !firestoreDb) return undefined;

    const notifySyncError = (error: unknown) => {
      console.error("Erro ao sincronizar dados da loja", error);
      if (!syncErrorShownRef.current) {
        syncErrorShownRef.current = true;
        toast.error("Falha ao sincronizar com o Firebase. O modo local continua disponível.");
      }
    };

    const unsubscribeSettings = onSnapshot(
      getSettingsRef(),
      (snapshot) => {
        if (!snapshot.exists()) {
          void setDoc(getSettingsRef(), defaultAdminSettings, { merge: true }).catch(notifySyncError);
          setAdminSettings(defaultAdminSettings);
          return;
        }

        setAdminSettings(normalizeAdminSettings(snapshot.data() as Partial<AdminSettings>));
      },
      notifySyncError,
    );

    const unsubscribeCatalog = onSnapshot(
      getCatalogRef(),
      (snapshot) => {
        if (!snapshot.exists()) {
          void setDoc(getCatalogRef(), { productOverrides: {}, customProducts: {}, deletedProductIds: [] }, { merge: true }).catch(notifySyncError);
          setProductOverrides({});
          setCustomProducts({});
          setDeletedProductIds([]);
          return;
        }

        const nextCatalog = normalizeCatalogData(snapshot.data());
        setProductOverrides(nextCatalog.productOverrides);
        setCustomProducts(nextCatalog.customProducts);
        setDeletedProductIds(nextCatalog.deletedProductIds);
      },
      notifySyncError,
    );

    const unsubscribeCustomers = onSnapshot(
      getCustomersCollectionRef(),
      (snapshot) => {
        const nextUsers = sortManagedUsers(snapshot.docs.map((item) => readManagedUser(item.data())));
        setManagedUsers(nextUsers);
      },
      notifySyncError,
    );

    const unsubscribeOrders = onSnapshot(
      getOrdersCollectionRef(),
      (snapshot) => {
        const nextOrders = sortOrders(snapshot.docs.map((item) => readOrder(item.data())));
        setOrders(nextOrders);
      },
      notifySyncError,
    );

    return () => {
      unsubscribeSettings();
      unsubscribeCatalog();
      unsubscribeCustomers();
      unsubscribeOrders();
    };
  }, [setAdminSettings, setManagedUsers, setOrders, setProductOverrides, setCustomProducts, setDeletedProductIds]);

  const products = useMemo(
    () => mergeProducts(productOverrides, customProducts, deletedProductIds),
    [customProducts, deletedProductIds, productOverrides],
  );

  const cartItems = useMemo<DetailedCartItem[]>(() => {
    return cart
      .map((entry) => {
        const product = products.find((item) => item.id === entry.productId);
        if (!product || (product.stockQuantity ?? 0) <= 0) return null;

        const safeQuantity = Math.min(entry.quantity, product.stockQuantity ?? entry.quantity);
        return {
          ...entry,
          quantity: safeQuantity,
          product,
          lineTotal: product.price * safeQuantity,
        };
      })
      .filter(Boolean) as DetailedCartItem[];
  }, [cart, products]);

  const cartCount = useMemo(() => cartItems.reduce((accumulator, item) => accumulator + item.quantity, 0), [cartItems]);
  const cartSubtotal = useMemo(() => cartItems.reduce((accumulator, item) => accumulator + item.lineTotal, 0), [cartItems]);
  const favoriteProducts = useMemo(() => products.filter((product) => favorites.includes(product.id)), [favorites, products]);

  const addToCart = (productId: string, quantity = 1) => {
    const product = products.find((item) => item.id === productId);
    const available = product?.stockQuantity ?? 0;

    if (!product || available <= 0) {
      toast.error("Produto indisponível no momento.");
      return;
    }

    setCart((previous) => {
      const existing = previous.find((item) => item.productId === productId);
      const nextQuantity = Math.min((existing?.quantity ?? 0) + quantity, available);

      if (existing) {
        return previous.map((item) => (item.productId === productId ? { ...item, quantity: nextQuantity } : item));
      }

      return [...previous, { productId, quantity: Math.min(quantity, available) }];
    });
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    const product = products.find((item) => item.id === productId);
    const available = product?.stockQuantity ?? 0;

    if (quantity <= 0 || available <= 0) {
      setCart((previous) => previous.filter((item) => item.productId !== productId));
      return;
    }

    setCart((previous) =>
      previous.map((item) => (item.productId === productId ? { ...item, quantity: Math.min(quantity, available) } : item)),
    );
  };

  const removeFromCart = (productId: string) => {
    setCart((previous) => previous.filter((item) => item.productId !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleFavorite = (productId: string) => {
    setFavorites((previous) =>
      previous.includes(productId) ? previous.filter((item) => item !== productId) : [...previous, productId],
    );
  };

  const updateCustomer = (nextValues: Partial<CustomerProfile>) => {
    const mergedCustomer = { ...customer, ...nextValues };
    setCustomer(mergedCustomer);

    if (!mergedCustomer.name && !mergedCustomer.email && !mergedCustomer.phone) {
      return;
    }

    setManagedUsers((previous) => {
      const nextUsers = sortManagedUsers(upsertManagedUser(previous, mergedCustomer));
      const syncedUser = nextUsers.find((user) => user.id === getCustomerId(mergedCustomer));

      if (firebaseReady && firestoreDb && syncedUser) {
        void setDoc(getCustomerDocRef(syncedUser.id), createRemoteManagedUserPayload(syncedUser), { merge: true }).catch((error) => {
          console.error("Falha ao sincronizar cliente", error);
        });
      }

      return nextUsers;
    });
  };

  const placeOrder = async ({ shippingOption, paymentMethod, customer: checkoutCustomer }: PlaceOrderPayload) => {
    if (!cartItems.length) return null;

    const order: OrderRecord = {
      id: `HH-${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString(),
      status: getStatusByPayment(paymentMethod),
      paymentMethod,
      shippingMethod: shippingOption.label,
      shippingEta: shippingOption.eta,
      shippingPrice: shippingOption.price,
      subtotal: cartSubtotal,
      total: cartSubtotal + shippingOption.price,
      customer: checkoutCustomer,
      items: cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
        image: item.product.image,
      })),
    };

    if (firebaseReady && firestoreDb) {
      try {
        const affectedOverrides: Record<string, ProductAdminOverride> = {};
        let syncedUser: ManagedUser | null = null;

        await runTransaction(firestoreDb, async (transaction) => {
          const catalogSnapshot = await transaction.get(getCatalogRef());
          const customerId = getCustomerId(checkoutCustomer);
          const customerRef = getCustomerDocRef(customerId);
          const customerSnapshot = await transaction.get(customerRef);

          const currentCatalog = normalizeCatalogData(catalogSnapshot.exists() ? catalogSnapshot.data() : null);
          const currentOverrides = currentCatalog.productOverrides;
          const currentProducts = mergeProducts(currentOverrides, currentCatalog.customProducts, currentCatalog.deletedProductIds);
          const currentUser = customerSnapshot.exists() ? readManagedUser(customerSnapshot.data()) : undefined;

          const nextUser = buildManagedUser(currentUser, checkoutCustomer, order.total);
          syncedUser = nextUser;

          cartItems.forEach((item) => {
            const currentProduct = currentProducts.find((product) => product.id === item.product.id);
            const currentQty = currentProduct?.stockQuantity ?? 0;

            if (currentQty < item.quantity) {
              throw new Error(`O estoque de ${item.product.name} mudou. Atualize o carrinho e tente novamente.`);
            }

            affectedOverrides[item.product.id] = {
              ...(currentOverrides[item.product.id] ?? {}),
              stockQuantity: Math.max(0, currentQty - item.quantity),
            };
          });

          transaction.set(getCatalogRef(), { productOverrides: affectedOverrides }, { merge: true });
          transaction.set(getOrderDocRef(order.id), createRemoteOrderPayload(order));
          transaction.set(customerRef, createRemoteManagedUserPayload(nextUser), { merge: true });
        });

        setOrders((previous) => sortOrders([order, ...previous.filter((item) => item.id !== order.id)]));
        setCustomerOrders((previous) => sortOrders([order, ...previous.filter((item) => item.id !== order.id)]));
        setCustomer(checkoutCustomer);
        setManagedUsers((previous) => {
          const withoutCurrent = previous.filter((item) => item.id !== syncedUser?.id);
          return sortManagedUsers(syncedUser ? [syncedUser, ...withoutCurrent] : previous);
        });
        setProductOverrides((previous) => {
          const next = { ...previous };
          Object.entries(affectedOverrides).forEach(([productId, updates]) => {
            next[productId] = {
              ...(next[productId] ?? {}),
              ...updates,
            };
          });
          return next;
        });
        setCart([]);
        return order;
      } catch (error) {
        console.error("Falha ao sincronizar pedido", error);
        toast.error(error instanceof Error ? error.message : "Não foi possível sincronizar o pedido em tempo real.");
        return null;
      }
    }

    const nextUsers = sortManagedUsers(upsertManagedUser(managedUsers, checkoutCustomer, order.total));
    setOrders((previous) => sortOrders([order, ...previous]));
    setCustomerOrders((previous) => sortOrders([order, ...previous]));
    setCustomer(checkoutCustomer);
    setManagedUsers(nextUsers);
    setProductOverrides((previous) => {
      const next = { ...previous };

      cartItems.forEach((item) => {
        const currentProduct = products.find((product) => product.id === item.product.id);
        const currentQty = currentProduct?.stockQuantity ?? 0;
        next[item.product.id] = {
          ...next[item.product.id],
          stockQuantity: Math.max(0, currentQty - item.quantity),
        };
      });

      return next;
    });
    setCart([]);
    return order;
  };

  const updateAdminSettings = (nextValues: Partial<AdminSettings>) => {
    setAdminSettings((previous) => {
      const next = { ...previous, ...nextValues };

      if (firebaseReady && firestoreDb) {
        void setDoc(getSettingsRef(), next, { merge: true }).catch((error) => {
          console.error("Falha ao sincronizar configurações", error);
        });
      }

      return next;
    });
  };

  const updateProductAdmin = (productId: string, updates: Partial<ProductAdminOverride>) => {
    setProductOverrides((previous) => ({
      ...previous,
      [productId]: {
        ...(previous[productId] ?? {}),
        ...updates,
      },
    }));

    if (firebaseReady && firestoreDb) {
      void setDoc(
        getCatalogRef(),
        {
          productOverrides: {
            [productId]: prepareProductOverrideForRemote(updates),
          },
        },
        { merge: true },
      ).catch((error) => {
        console.error("Falha ao sincronizar produto", error);
      });
    }
  };



  const addProduct = async (input: Omit<CustomProductInput, "id"> & { id?: string }) => {
    const name = input.name.trim();
    if (!name) {
      toast.error("Informe o nome do produto.");
      return null;
    }

    const productId = slugifyProductId(input.id?.trim() || name);
    const product = buildProductFromInput({
      ...input,
      id: productId,
      image: input.image?.trim() || placeholderProductImage,
    });

    if (products.some((item) => item.id === productId)) {
      toast.error("Já existe um produto com esse identificador.");
      return null;
    }

    setCustomProducts((previous) => ({
      ...previous,
      [productId]: product,
    }));
    setDeletedProductIds((previous) => previous.filter((item) => item !== productId));

    if (firebaseReady && firestoreDb) {
      try {
        await setDoc(
          getCatalogRef(),
          {
            customProducts: {
              [productId]: product,
            },
          },
          { merge: true },
        );
      } catch (error) {
        console.error("Falha ao adicionar produto", error);
        toast.error("Não foi possível salvar o novo produto no Firebase.");
        return null;
      }
    }

    toast.success("Produto criado com sucesso.");
    return productId;
  };

  const updateCustomProduct = (productId: string, updates: Partial<Omit<CustomProductInput, "id">>) => {
    const currentProduct = customProducts[productId];
    if (!currentProduct) return;

    const nextProduct = buildProductFromInput({
      id: productId,
      name: updates.name ?? currentProduct.name,
      category: (updates.category as CustomProductInput["category"]) ?? currentProduct.category,
      price: updates.price ?? currentProduct.price,
      compareAtPrice: updates.compareAtPrice ?? currentProduct.compareAtPrice,
      image: updates.image ?? currentProduct.image,
      badge: updates.badge ?? currentProduct.badge,
      description: updates.description ?? currentProduct.description,
      highlight: updates.highlight ?? currentProduct.highlight,
      stockQuantity: updates.stockQuantity ?? currentProduct.stockQuantity ?? 0,
      active: updates.active ?? currentProduct.active,
      featured: updates.featured ?? currentProduct.featured,
    });

    setCustomProducts((previous) => ({
      ...previous,
      [productId]: nextProduct,
    }));

    if (firebaseReady && firestoreDb) {
      void setDoc(
        getCatalogRef(),
        {
          customProducts: {
            [productId]: nextProduct,
          },
        },
        { merge: true },
      ).catch((error) => {
        console.error("Falha ao atualizar produto personalizado", error);
      });
    }
  };

  const deleteProduct = async (productId: string) => {
    const isCustomProduct = Boolean(customProducts[productId]);

    setCart((previous) => previous.filter((item) => item.productId !== productId));
    setFavorites((previous) => previous.filter((item) => item !== productId));

    if (isCustomProduct) {
      setCustomProducts((previous) => {
        const next = { ...previous };
        delete next[productId];
        return next;
      });

      if (firebaseReady && firestoreDb) {
        await setDoc(
          getCatalogRef(),
          {
            customProducts: {
              [productId]: deleteField(),
            },
          },
          { merge: true },
        ).catch((error) => {
          console.error("Falha ao excluir produto personalizado", error);
          throw error;
        });
      }

      toast.success("Produto excluído.");
      return;
    }

    setDeletedProductIds((previous) => Array.from(new Set([...previous, productId])));

    if (firebaseReady && firestoreDb) {
      const nextDeleted = Array.from(new Set([...deletedProductIds, productId]));
      await setDoc(
        getCatalogRef(),
        {
          deletedProductIds: nextDeleted,
          productOverrides: {
            [productId]: deleteField(),
          },
        },
        { merge: true },
      ).catch((error) => {
        console.error("Falha ao excluir produto base", error);
        throw error;
      });
    }

    setProductOverrides((previous) => {
      const next = { ...previous };
      delete next[productId];
      return next;
    });
    toast.success("Produto removido da loja.");
  };

  const updateManagedUser = (userId: string, updates: Partial<ManagedUser>) => {
    setManagedUsers((previous) => {
      const nextUsers = sortManagedUsers(
        previous.map((user) =>
          user.id === userId ? { ...user, ...updates, updatedAt: new Date().toISOString() } : user,
        ),
      );
      const updatedUser = nextUsers.find((user) => user.id === userId);

      if (firebaseReady && firestoreDb && updatedUser) {
        void setDoc(getCustomerDocRef(updatedUser.id), createRemoteManagedUserPayload(updatedUser), { merge: true }).catch((error) => {
          console.error("Falha ao sincronizar cliente", error);
        });
      }

      return nextUsers;
    });
  };

  const value = useMemo(
    () => ({
      products,
      adminSettings,
      productOverrides,
      managedUsers,
      cart,
      favorites,
      customer,
      orders,
      customerOrders,
      cartItems,
      cartCount,
      cartSubtotal,
      favoriteProducts,
      isRealtimeEnabled: firebaseReady,
      addToCart,
      updateCartQuantity,
      removeFromCart,
      clearCart,
      toggleFavorite,
      updateCustomer,
      placeOrder,
      updateAdminSettings,
      updateProductAdmin,
      addProduct,
      updateCustomProduct,
      deleteProduct,
      updateManagedUser,
    }),
    [
      adminSettings,
      cart,
      cartCount,
      cartItems,
      cartSubtotal,
      customer,
      customerOrders,
      favoriteProducts,
      favorites,
      managedUsers,
      orders,
      productOverrides,
      customProducts,
      deletedProductIds,
      products,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
