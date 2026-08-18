"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, COLLECTIONS, GENDERS, METALS, ORIGINS, PURITIES } from "@/lib/constants";
import { slugify } from "@/lib/format";
import type { Category, Gender, MetalColor, Origin, Product, ProductInput, Purity } from "@/lib/types";

const empty: ProductInput = {
  sku: "",
  slug: "",
  name: "",
  nameHy: "",
  description: "",
  price: 0,
  oldPrice: undefined,
  category: "rings",
  metal: "yellow",
  purity: 585,
  weight: 1,
  gender: "women",
  sizes: [],
  stones: [],
  collection: "Русская классика",
  origin: "russia",
  inspiredBy: "",
  inStock: true,
  stockCount: 1,
  isHit: false,
  isNew: true,
  images: [],
  article: "",
  warrantyMonths: 24,
};

function toInput(product?: Product): ProductInput {
  if (!product) return empty;
  return {
    sku: product.sku,
    slug: product.slug,
    name: product.name,
    nameHy: product.nameHy,
    description: product.description,
    price: product.price,
    oldPrice: product.oldPrice,
    category: product.category,
    metal: product.metal,
    purity: product.purity,
    weight: product.weight,
    gender: product.gender,
    sizes: product.sizes,
    stones: product.stones,
    collection: product.collection,
    origin: product.origin,
    inspiredBy: product.inspiredBy,
    inStock: product.inStock,
    stockCount: product.stockCount,
    isHit: product.isHit,
    isNew: product.isNew,
    images: product.images,
    article: product.article,
    warrantyMonths: product.warrantyMonths,
    rating: product.rating,
    reviewCount: product.reviewCount,
    reviews: product.reviews,
  };
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<ProductInput>(toInput(product));
  const [sizes, setSizes] = useState(product?.sizes.join(", ") || "");
  const [stones, setStones] = useState(product?.stones.join(", ") || "");
  const [images, setImages] = useState(product?.images.join("\n") || "");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  function patch<K extends keyof ProductInput>(key: K, value: ProductInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function upload(file: File) {
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: data });
    const json = await res.json();
    if (json.url) setImages((prev) => [prev, json.url].filter(Boolean).join("\n"));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const payload: ProductInput = {
      ...form,
      slug: form.slug || slugify(form.name),
      sku: form.sku || `VOSKE-${form.purity}-${Date.now().toString().slice(-5)}`,
      article: form.article || form.sku,
      sizes: sizes.split(",").map((s) => s.trim()).filter(Boolean),
      stones: stones.split(",").map((s) => s.trim()).filter(Boolean),
      images: images.split("\n").map((s) => s.trim()).filter(Boolean),
      oldPrice: form.oldPrice || undefined,
    };
    const res = await fetch(product ? `/api/products/${product.id}` : "/api/products", {
      method: product ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error || "Ошибка сохранения");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
      <Field label="Название">
        <input required value={form.name} onChange={(e) => patch("name", e.target.value)} />
      </Field>
      <Field label="Название на армянском">
        <input value={form.nameHy} onChange={(e) => patch("nameHy", e.target.value)} />
      </Field>
      <Field label="Адрес страницы (slug)">
        <input value={form.slug} onChange={(e) => patch("slug", e.target.value)} placeholder="авто из названия" />
      </Field>
      <Field label="Артикул / SKU">
        <input value={form.sku} onChange={(e) => patch("sku", e.target.value)} />
      </Field>
      <label className="md:col-span-2 flex flex-col gap-1 text-sm">
        Описание
        <textarea className="min-h-28 border border-[var(--line)] bg-transparent px-3 py-2" value={form.description} onChange={(e) => patch("description", e.target.value)} />
      </label>
      <Field label="Цена, ₽">
        <input type="number" required value={form.price} onChange={(e) => patch("price", Number(e.target.value))} />
      </Field>
      <Field label="Старая цена, ₽">
        <input type="number" value={form.oldPrice || ""} onChange={(e) => patch("oldPrice", e.target.value ? Number(e.target.value) : undefined)} />
      </Field>
      <Field label="Категория">
        <select value={form.category} onChange={(e) => patch("category", e.target.value as Category)}>
          {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Цвет золота">
        <select value={form.metal} onChange={(e) => patch("metal", e.target.value as MetalColor)}>
          {METALS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Проба">
        <select value={form.purity} onChange={(e) => patch("purity", Number(e.target.value) as Purity)}>
          {PURITIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Вес, г">
        <input type="number" step="0.01" value={form.weight} onChange={(e) => patch("weight", Number(e.target.value))} />
      </Field>
      <Field label="Для кого">
        <select value={form.gender} onChange={(e) => patch("gender", e.target.value as Gender)}>
          {GENDERS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Страна">
        <select value={form.origin} onChange={(e) => patch("origin", e.target.value as Origin)}>
          {ORIGINS.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
        </select>
      </Field>
      <Field label="Коллекция">
        <select value={form.collection} onChange={(e) => patch("collection", e.target.value)}>
          {COLLECTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="В духе бренда">
        <input value={form.inspiredBy} onChange={(e) => patch("inspiredBy", e.target.value)} />
      </Field>
      <Field label="Размеры через запятую">
        <input value={sizes} onChange={(e) => setSizes(e.target.value)} />
      </Field>
      <Field label="Камни через запятую">
        <input value={stones} onChange={(e) => setStones(e.target.value)} />
      </Field>
      <Field label="Остаток, шт.">
        <input type="number" value={form.stockCount} onChange={(e) => patch("stockCount", Number(e.target.value))} />
      </Field>
      <Field label="Гарантия, мес.">
        <input type="number" value={form.warrantyMonths} onChange={(e) => patch("warrantyMonths", Number(e.target.value))} />
      </Field>
      <Field label="Внутренний артикул">
        <input value={form.article} onChange={(e) => patch("article", e.target.value)} />
      </Field>
      <label className="md:col-span-2 flex flex-col gap-1 text-sm">
        Изображения — по одному URL на строку
        <textarea className="min-h-24 border border-[var(--line)] bg-transparent px-3 py-2" value={images} onChange={(e) => setImages(e.target.value)} />
        <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])} />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.inStock} onChange={(e) => patch("inStock", e.target.checked)} /> В наличии
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isHit} onChange={(e) => patch("isHit", e.target.checked)} /> Хит
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={form.isNew} onChange={(e) => patch("isNew", e.target.checked)} /> Новинка
      </label>
      {error && <p className="md:col-span-2 text-[var(--pomegranate)]">{error}</p>}
      <button disabled={pending} className="md:col-span-2 bg-[var(--ink)] py-3 text-sm uppercase tracking-[0.18em] text-[var(--cream)]">
        {pending ? "Сохраняем..." : "Сохранить украшение"}
      </button>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      {label}
      <div className="[&>*]:w-full [&>*]:border [&>*]:border-[var(--line)] [&>*]:bg-transparent [&>*]:px-3 [&>*]:py-2">
        {children}
      </div>
    </label>
  );
}
