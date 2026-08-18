"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, COLLECTIONS, GENDERS, METALS, ORIGINS, PURITIES } from "@/lib/constants";
import { COLLECTION_KEY } from "@/lib/i18n";
import { productName } from "@/lib/product-i18n";
import { ProductCard } from "@/components/ProductCard";
import { useI18n } from "@/components/I18nProvider";
import { useStore } from "@/components/StoreProvider";
import type { Category, Gender, MetalColor, Origin, Purity } from "@/lib/types";

export default function CatalogPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { t, locale } = useI18n();
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
      list = list.filter((p) => `${productName(p, locale)} ${p.sku} ${p.inspiredBy}`.toLowerCase().includes(q));
    }
    if (selected.sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (selected.sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (selected.sort === "new") list.sort((a, b) => Number(b.isNew) - Number(a.isNew));
    if (selected.sort === "hit") list.sort((a, b) => Number(b.isHit) - Number(a.isHit));
    return list;
  }, [products, selected, locale]);

  const selectClass = "field";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-8">
      <p className="kicker">{t("catalog.kicker")}</p>
      <h1 className="font-serif mt-2 text-5xl">{t("catalog.title")}</h1>
      <p className="mt-3 max-w-2xl text-[var(--ink-soft)]">{t("catalog.lead")}</p>

      <div className="mt-8 grid gap-3 md:grid-cols-4 lg:grid-cols-7">
        <select className={selectClass} value={selected.category || ""} onChange={(e) => setParam("category", e.target.value)}>
          <option value="">{t("catalog.allCat")}</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.id}>{t(`cat.${c.id}`)}</option>
          ))}
        </select>
        <select className={selectClass} value={selected.metal || ""} onChange={(e) => setParam("metal", e.target.value)}>
          <option value="">{t("catalog.metal")}</option>
          {METALS.map((c) => (
            <option key={c.id} value={c.id}>{t(`metal.${c.id}`)}</option>
          ))}
        </select>
        <select className={selectClass} value={selected.purity || ""} onChange={(e) => setParam("purity", e.target.value)}>
          <option value="">{t("catalog.purity")}</option>
          {PURITIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={selectClass} value={selected.gender || ""} onChange={(e) => setParam("gender", e.target.value)}>
          <option value="">{t("catalog.who")}</option>
          {GENDERS.map((c) => (
            <option key={c.id} value={c.id}>{t(`gender.${c.id}`)}</option>
          ))}
        </select>
        <select className={selectClass} value={selected.origin || ""} onChange={(e) => setParam("origin", e.target.value)}>
          <option value="">{t("catalog.country")}</option>
          {ORIGINS.map((c) => (
            <option key={c.id} value={c.id}>{t(`origin.${c.id}`)}</option>
          ))}
        </select>
        <select className={selectClass} value={selected.collection || ""} onChange={(e) => setParam("collection", e.target.value)}>
          <option value="">{t("catalog.collection")}</option>
          {COLLECTIONS.map((c) => (
            <option key={c} value={c}>{t(`col.${COLLECTION_KEY[c] || "classic"}`)}</option>
          ))}
        </select>
        <select className={selectClass} value={selected.sort} onChange={(e) => setParam("sort", e.target.value)}>
          <option value="hit">{t("catalog.sortHits")}</option>
          <option value="new">{t("catalog.sortNew")}</option>
          <option value="price-asc">{t("catalog.sortAsc")}</option>
          <option value="price-desc">{t("catalog.sortDesc")}</option>
        </select>
      </div>

      <p className="mt-6 text-sm text-[var(--ink-soft)]">
        {loaded ? t("catalog.count", { n: filtered.length }) : t("catalog.loading")}
      </p>
      <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4 lg:gap-x-8">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {loaded && filtered.length === 0 && <p className="py-20 text-center text-[var(--ink-soft)]">{t("catalog.empty")}</p>}
    </div>
  );
}
