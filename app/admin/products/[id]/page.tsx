"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductForm } from "@/components/ProductForm";
import type { Product } from "@/lib/types";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [id]);

  if (!product?.id) {
    return <p className="text-sm text-[var(--ink-soft)]">Загружаем карточку…</p>;
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/products" className="text-sm text-[var(--ink-soft)] underline underline-offset-4">
        ← К витрине
      </Link>
      <p className="kicker mt-4">Правка</p>
      <h1 className="font-serif mt-1 mb-6 text-3xl sm:text-4xl">{product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
