"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { CartItem, Product } from "@/lib/types";
import { useI18n } from "./I18nProvider";

type Toast = { id: number; text: string };

type StoreContextValue = {
  products: Product[];
  loaded: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  favorites: string[];
  addToCart: (item: CartItem) => void;
  setQty: (productId: string, quantity: number, size?: string) => void;
  changeSize: (productId: string, oldSize: string | undefined, newSize: string) => void;
  removeFromCart: (productId: string, size?: string) => void;
  clearCart: () => void;
  toggleFavorite: (productId: string) => void;
  toast: (text: string) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function sameLine(a: CartItem, b: Pick<CartItem, "productId" | "size">) {
  return a.productId === b.productId && (a.size || "") === (b.size || "");
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [products, setProducts] = useState<Product[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const refreshProducts = useCallback(async () => {
    const res = await fetch("/api/products", { cache: "no-store" });
    const data = (await res.json()) as Product[];
    setProducts(data);
    setLoaded(true);
  }, []);

  useEffect(() => {
    refreshProducts();
    try {
      const storedCart = localStorage.getItem("voske-cart");
      const storedFav = localStorage.getItem("voske-fav");
      if (storedCart) setCart(JSON.parse(storedCart));
      if (storedFav) setFavorites(JSON.parse(storedFav));
    } catch {
      /* ignore */
    }
  }, [refreshProducts]);

  useEffect(() => {
    localStorage.setItem("voske-cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("voske-fav", JSON.stringify(favorites));
  }, [favorites]);

  const toast = useCallback((text: string) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 2800);
  }, []);

  const addToCart = useCallback(
    (item: CartItem) => {
      setCart((prev) => {
        const index = prev.findIndex((line) => sameLine(line, item));
        if (index === -1) return [...prev, item];
        const next = [...prev];
        next[index] = { ...next[index], quantity: next[index].quantity + item.quantity };
        return next;
      });
      toast(t("toast.cart"));
    },
    [toast, t],
  );

  const setQty = useCallback((productId: string, quantity: number, size?: string) => {
    setCart((prev) =>
      prev
        .map((line) => (sameLine(line, { productId, size }) ? { ...line, quantity } : line))
        .filter((line) => line.quantity > 0),
    );
  }, []);

  const changeSize = useCallback((productId: string, oldSize: string | undefined, newSize: string) => {
    if ((oldSize || "") === newSize) return;
    setCart((prev) => {
      const current = prev.find((line) => sameLine(line, { productId, size: oldSize }));
      if (!current) return prev;
      const without = prev.filter((line) => !sameLine(line, { productId, size: oldSize }));
      const existing = without.findIndex((line) => sameLine(line, { productId, size: newSize }));
      if (existing >= 0) {
        const next = [...without];
        next[existing] = { ...next[existing], quantity: next[existing].quantity + current.quantity };
        return next;
      }
      return [...without, { ...current, size: newSize }];
    });
  }, []);

  const removeFromCart = useCallback((productId: string, size?: string) => {
    setCart((prev) => prev.filter((line) => !sameLine(line, { productId, size })));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const toggleFavorite = useCallback(
    (productId: string) => {
      setFavorites((prev) => {
        const exists = prev.includes(productId);
        toast(exists ? t("toast.favOff") : t("toast.favOn"));
        return exists ? prev.filter((id) => id !== productId) : [...prev, productId];
      });
    },
    [toast, t],
  );

  const value = useMemo(
    () => ({
      products,
      loaded,
      refreshProducts,
      cart,
      favorites,
      addToCart,
      setQty,
      changeSize,
      removeFromCart,
      clearCart,
      toggleFavorite,
      toast,
    }),
    [
      products,
      loaded,
      refreshProducts,
      cart,
      favorites,
      addToCart,
      setQty,
      changeSize,
      removeFromCart,
      clearCart,
      toggleFavorite,
      toast,
    ],
  );

  return (
    <StoreContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[80] flex flex-col gap-2">
        {toasts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto bg-[#0b0b0b] px-4 py-2 text-sm text-white"
          >
            {item.text}
          </div>
        ))}
      </div>
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("StoreProvider missing");
  return ctx;
}
