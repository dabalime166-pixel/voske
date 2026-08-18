"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, COLLECTIONS, GENDERS, METALS, ORIGINS, PURITIES } from "@/lib/constants";
import { ProductCard } from "@/components/ProductCard";
import { useStore } from "@/components/StoreProvider";
import type { Category, Gender, MetalColor, Origin, Purity } from "@/lib/types";

export default function CatalogPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { products, loaded } = useStore();

  const selected = {
    category: params.get("category") as Category | null,
    metal: params.get("metal") as MetalColor | null,
    purity: params.get("purity") ? (Number(params.get("purity")) as Purity) : null,
    gender: params.get("gender") as Gender | null,
    origin: params.get("origin") as Origin | null,
    collection: params.get("collection"),
    hit: params.get("hit") === "1",
    q: params.get("q") || "",
    sort: params.get("sort") || "hit",
  };

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (!value) next.delete(key);
    else next.set(key, value);
    router.push(`/catalog?${next.toString()}`);
  }

  const filtered = useMemo(() => {
    let list = [...products];
    if (selected.category) list = list.filter((p) => p.category === selected.category);
    if (selected.metal) list = list.filter((p) => p.metal === selected.metal);
    if (selected.purity) list = list.filter((p) => p.purity === selected.purity);
    if (selected.gender) list = list.filter((p) => p.gender === selected.gender);
    if (selected.origin) list = list.filter((p) => p.origin === selected.origin);
    if (selected.collection) list = list.filter((p) => p.collection === selected.collection);
    if (selected.hit) list = list.filter((p) => p.isHit);
    if (selected.q) {
      const q = selected.q.toLowerCase();
      list = list.filter((p) => `${p.name} ${p.sku} ${p.inspiredBy} ${p.stones.join(" ")}`.toLowerCase().includes(q));
    }
    if (selected.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (selected.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (selected.sort === "new") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (selected.sort === "hit") list.sort((a, b) => Number(b.isHit) - Number(a.isHit));
    return list;
  }, [products, selected]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-deep)]">Каталог</p>
      <h1 className="font-serif text-5xl">Золотая витрина</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">
        Фильтры как у SUNLIGHT и SOKOLOV: металл, проба, для кого, происхождение. Демо-модели собраны по эстетике топовых домов России и Армении.
      </p>

      <div className="mt-8 grid gap-3 md:grid-cols-4 lg:grid-cols-7">
        <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={selected.category || ""} onChange={(e) => setParam("category", e.target.value)}>
          <option value="">Все категории</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={selected.metal || ""} onChange={(e) => setParam("metal", e.target.value)}>
          <option value="">Цвет золота</option>
          {METALS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={selected.purity || ""} onChange={(e) => setParam("purity", e.target.value)}>
          <option value="">Проба</option>
          {PURITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={selected.gender || ""} onChange={(e) => setParam("gender", e.target.value)}>
          <option value="">Для кого</option>
          {GENDERS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={selected.origin || ""} onChange={(e) => setParam("origin", e.target.value)}>
          <option value="">Страна</option>
          {ORIGINS.map((c) => (
            <option key={c.id} value={c.id}>{c.label}</option>
          ))}
        </select>
        <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={selected.collection || ""} onChange={(e) => setParam("collection", e.target.value)}>
          <option value="">Коллекция</option>
          {COLLECTIONS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className="border border-[var(--line)] bg-transparent px-3 py-2" value={selected.sort} onChange={(e) => setParam("sort", e.target.value)}>
          <option value="hit">Сначала хиты</option>
          <option value="new">Новинки</option>
          <option value="price-asc">Цена ↑</option>
          <option value="price-desc">Цена ↓</option>
        </select>
      </div>

      <p className="mt-6 text-sm text-[var(--ink-soft)]">{loaded ? `${filtered.length} украшений` : "Загрузка витрины..."}</p>
      <div className="mt-6 grid grid-cols-2 gap-6 lg:grid-cols-4">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {loaded && filtered.length === 0 && <p className="py-20 text-center text-[var(--ink-soft)]">Нет изделий по этим фильтрам</p>}
    </div>
  );
}
