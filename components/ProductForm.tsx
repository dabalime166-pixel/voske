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
  nameEn: "",
  description: "",
  descriptionHy: "",
  descriptionEn: "",
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
    nameEn: product.nameEn || "",
    description: product.description,
    descriptionHy: product.descriptionHy || "",
    descriptionEn: product.descriptionEn || "",
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
      sizes: sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      stones: stones
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      images: images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
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
    <form onSubmit={submit} className="space-y-4 pb-24 md:pb-0">
      <Section title="Названия">
        <Field label="Название / RU">
          <input className="admin-field" required value={form.name} onChange={(e) => patch("name", e.target.value)} />
        </Field>
        <Field label="Հայերեն / HY">
          <input className="admin-field" value={form.nameHy} onChange={(e) => patch("nameHy", e.target.value)} />
        </Field>
        <Field label="English / EN">
          <input className="admin-field" value={form.nameEn || ""} onChange={(e) => patch("nameEn", e.target.value)} />
        </Field>
        <Field label="Slug страницы">
          <input
            className="admin-field"
            value={form.slug}
            onChange={(e) => patch("slug", e.target.value)}
            placeholder="авто из названия"
          />
        </Field>
        <Field label="SKU">
          <input className="admin-field" value={form.sku} onChange={(e) => patch("sku", e.target.value)} />
        </Field>
        <Field label="Внутренний артикул">
          <input className="admin-field" value={form.article} onChange={(e) => patch("article", e.target.value)} />
        </Field>
      </Section>

      <Section title="Описание">
        <Field label="Описание / RU" wide>
          <textarea className="admin-field min-h-28" value={form.description} onChange={(e) => patch("description", e.target.value)} />
        </Field>
        <Field label="Նկարագրություն / HY">
          <textarea
            className="admin-field min-h-24"
            value={form.descriptionHy || ""}
            onChange={(e) => patch("descriptionHy", e.target.value)}
          />
        </Field>
        <Field label="Description / EN">
          <textarea
            className="admin-field min-h-24"
            value={form.descriptionEn || ""}
            onChange={(e) => patch("descriptionEn", e.target.value)}
          />
        </Field>
      </Section>

      <Section title="Цена и склад">
        <Field label="Цена, ₽">
          <input
            className="admin-field"
            type="number"
            inputMode="decimal"
            required
            value={form.price}
            onChange={(e) => patch("price", Number(e.target.value))}
          />
        </Field>
        <Field label="Старая цена, ₽">
          <input
            className="admin-field"
            type="number"
            inputMode="decimal"
            value={form.oldPrice || ""}
            onChange={(e) => patch("oldPrice", e.target.value ? Number(e.target.value) : undefined)}
          />
        </Field>
        <Field label="Остаток, шт.">
          <input
            className="admin-field"
            type="number"
            inputMode="numeric"
            value={form.stockCount}
            onChange={(e) => patch("stockCount", Number(e.target.value))}
          />
        </Field>
        <Field label="Гарантия, мес.">
          <input
            className="admin-field"
            type="number"
            inputMode="numeric"
            value={form.warrantyMonths}
            onChange={(e) => patch("warrantyMonths", Number(e.target.value))}
          />
        </Field>
        <div className="col-span-full flex flex-wrap gap-4 pt-1">
          <Toggle checked={form.inStock} onChange={(v) => patch("inStock", v)} label="В наличии" />
          <Toggle checked={form.isHit} onChange={(v) => patch("isHit", v)} label="Хит" />
          <Toggle checked={form.isNew} onChange={(v) => patch("isNew", v)} label="Новинка" />
        </div>
      </Section>

      <Section title="Параметры">
        <Field label="Категория">
          <select className="admin-field" value={form.category} onChange={(e) => patch("category", e.target.value as Category)}>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Цвет золота">
          <select className="admin-field" value={form.metal} onChange={(e) => patch("metal", e.target.value as MetalColor)}>
            {METALS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Проба">
          <select className="admin-field" value={form.purity} onChange={(e) => patch("purity", Number(e.target.value) as Purity)}>
            {PURITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Вес, г">
          <input
            className="admin-field"
            type="number"
            step="0.01"
            inputMode="decimal"
            value={form.weight}
            onChange={(e) => patch("weight", Number(e.target.value))}
          />
        </Field>
        <Field label="Для кого">
          <select className="admin-field" value={form.gender} onChange={(e) => patch("gender", e.target.value as Gender)}>
            {GENDERS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Страна">
          <select className="admin-field" value={form.origin} onChange={(e) => patch("origin", e.target.value as Origin)}>
            {ORIGINS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Коллекция">
          <select className="admin-field" value={form.collection} onChange={(e) => patch("collection", e.target.value)}>
            {COLLECTIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </Field>
        <Field label="В духе бренда">
          <input className="admin-field" value={form.inspiredBy} onChange={(e) => patch("inspiredBy", e.target.value)} />
        </Field>
        <Field label="Размеры через запятую" wide>
          <input className="admin-field" value={sizes} onChange={(e) => setSizes(e.target.value)} placeholder="16, 16.5, 17" />
        </Field>
        <Field label="Камни через запятую" wide>
          <input className="admin-field" value={stones} onChange={(e) => setStones(e.target.value)} placeholder="бриллиант, гранат" />
        </Field>
      </Section>

      <Section title="Фото">
        <Field label="URL изображений — по одному на строку" wide>
          <textarea className="admin-field min-h-24" value={images} onChange={(e) => setImages(e.target.value)} />
        </Field>
        <label className="col-span-full">
          <span className="admin-btn admin-btn-ghost w-full cursor-pointer sm:w-auto">
            Загрузить фото
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
            />
          </span>
        </label>
      </Section>

      {error && <p className="text-sm text-[var(--pomegranate)]">{error}</p>}

      <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom,0px))] z-20 border-t border-[var(--line)] bg-white/95 p-3 backdrop-blur md:static md:z-auto md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary w-full disabled:opacity-50">
          {pending ? "Сохраняем…" : "Сохранить украшение"}
        </button>
      </div>
    </form>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="admin-card p-4 sm:p-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-soft)]">{title}</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Field({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <label className={`flex flex-col gap-1.5 text-sm ${wide ? "sm:col-span-2" : ""}`}>
      <span className="text-[var(--ink-soft)]">{label}</span>
      {children}
    </label>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex min-h-11 items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="h-4 w-4 accent-[#0b0b0b]"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label}
    </label>
  );
}
