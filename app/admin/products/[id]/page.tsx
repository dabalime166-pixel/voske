"use client";

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

  if (!product?.id) return <p>Загружаем карточку...</p>;

  return (
    <div className="max-w-4xl">
      <h1 className="font-serif mb-8 text-4xl">Правка · {product.name}</h1>
      <ProductForm product={product} />
    </div>
  );
}
