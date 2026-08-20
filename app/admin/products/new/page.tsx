import Link from "next/link";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <Link href="/admin/products" className="text-sm text-[var(--ink-soft)] underline underline-offset-4">
        ← К витрине
      </Link>
      <p className="kicker mt-4">Новое</p>
      <h1 className="font-serif mt-1 mb-6 text-3xl sm:text-4xl">Украшение</h1>
      <ProductForm />
    </div>
  );
}
