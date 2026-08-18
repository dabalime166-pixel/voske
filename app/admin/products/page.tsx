"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { formatRub } from "@/lib/format";
import { useStore } from "@/components/StoreProvider";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { refreshProducts } = useStore();
  const [products, setProducts] = useState<Product[]>([]);

  async function load() {
    const res = await fetch("/api/products", { cache: "no-store" });
    setProducts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  async function remove(id: string, name: string) {
    if (!confirm(`Удалить «${name}»?`)) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
    await refreshProducts();
  }

  async function reset() {
    if (!confirm("Вернуть демо-каталог VOSKE?")) return;
    await fetch("/api/admin/reset", { method: "POST" });
    await load();
    await refreshProducts();
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl">Витрина</h1>
          <p className="mt-1 text-white/50">{products.length} изделий · можно менять любой параметр</p>
        </div>
        <div className="flex gap-3">
          <button onClick={reset} className="border border-white/20 px-4 py-2 text-xs uppercase tracking-[0.16em]">
            Сбросить демо
          </button>
          <Link href="/admin/products/new" className="bg-[var(--gold)] px-4 py-2 text-xs uppercase tracking-[0.16em] text-[var(--ink)]">
            Добавить
          </Link>
        </div>
      </div>
      <div className="mt-8 divide-y divide-white/10 border border-white/10">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 px-4 py-3">
            <div className="relative h-16 w-14 overflow-hidden bg-black/30">
              <Image src={product.images[0] || "/images/voske-logo.jpg"} alt="" fill className="object-cover" />
            </div>
            <div className="flex-1">
              <p>{product.name}</p>
              <p className="text-xs text-white/50">
                {product.sku} · {product.purity} · {product.weight} г · остаток {product.stockCount}
              </p>
            </div>
            <span className="hidden sm:block">{formatRub(product.price)}</span>
            <Link href={`/admin/products/${product.id}`} className="text-sm underline">
              Править
            </Link>
            <button onClick={() => remove(product.id, product.name)} className="text-sm text-[var(--gold)]">
              Удалить
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
