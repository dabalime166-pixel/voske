"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { formatRub } from "@/lib/format";
import { useStore } from "@/components/StoreProvider";
import type { Product } from "@/lib/types";

export default function AdminProductsPage() {
  const { refreshProducts } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [q, setQ] = useState("");

  async function load() {
    const res = await fetch("/api/products", { cache: "no-store" });
    setProducts(await res.json());
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return products;
    return products.filter((p) =>
      `${p.name} ${p.sku} ${p.article} ${p.collection}`.toLowerCase().includes(needle),
    );
  }, [products, q]);

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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="kicker">Каталог</p>
          <h1 className="font-serif mt-1 text-3xl sm:text-4xl">Витрина</h1>
          <p className="mt-1 text-sm text-[var(--ink-soft)]">{products.length} изделий</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <button type="button" onClick={reset} className="admin-btn admin-btn-ghost w-full sm:w-auto">
            Сбросить демо
          </button>
          <Link href="/admin/products/new" className="admin-btn admin-btn-primary w-full sm:w-auto">
            Добавить
          </Link>
        </div>
      </div>

      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Поиск по названию, SKU…"
        className="admin-field mt-6"
        inputMode="search"
      />

      <div className="mt-4 space-y-3 md:hidden">
        {filtered.map((product) => (
          <article key={product.id} className="admin-card p-3">
            <div className="flex gap-3">
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-[var(--muted)]">
                <Image src={product.images[0] || "/images/voske-logo.jpg"} alt="" fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{product.name}</p>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  {product.sku} · {product.purity} · {product.weight} г
                </p>
                <p className="mt-1 text-sm font-medium">{formatRub(product.price)}</p>
                <p className="mt-1 text-xs text-[var(--ink-soft)]">
                  Остаток {product.stockCount}
                  {product.stockCount <= 2 ? " · мало" : ""}
                </p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link href={`/admin/products/${product.id}`} className="admin-btn admin-btn-ghost">
                Править
              </Link>
              <button type="button" onClick={() => remove(product.id, product.name)} className="admin-btn admin-btn-danger">
                Удалить
              </button>
            </div>
          </article>
        ))}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-[var(--ink-soft)]">Ничего не найдено</p>}
      </div>

      <div className="admin-card mt-4 hidden divide-y divide-[var(--line)] md:block">
        {filtered.map((product) => (
          <div key={product.id} className="flex items-center gap-4 px-4 py-3">
            <div className="relative h-16 w-14 overflow-hidden bg-[var(--muted)]">
              <Image src={product.images[0] || "/images/voske-logo.jpg"} alt="" fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate">{product.name}</p>
              <p className="text-xs text-[var(--ink-soft)]">
                {product.sku} · {product.purity} · {product.weight} г · остаток {product.stockCount}
              </p>
            </div>
            <span className="w-28 text-right text-sm">{formatRub(product.price)}</span>
            <Link href={`/admin/products/${product.id}`} className="admin-btn admin-btn-ghost px-3 py-2 text-[0.65rem]">
              Править
            </Link>
            <button type="button" onClick={() => remove(product.id, product.name)} className="admin-btn admin-btn-danger px-3 py-2 text-[0.65rem]">
              Удалить
            </button>
          </div>
        ))}
        {filtered.length === 0 && <p className="p-6 text-sm text-[var(--ink-soft)]">Ничего не найдено</p>}
      </div>
    </div>
  );
}
