import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { getProducts, saveProduct } from "@/lib/store";
import type { ProductInput } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  const products = await getProducts();
  return NextResponse.json(products);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  const body = (await request.json()) as ProductInput;
  if (!body.name || !body.slug || !body.price) {
    return NextResponse.json({ error: "Заполните имя, адрес и цену" }, { status: 400 });
  }
  const product = await saveProduct({ ...body, id: undefined });
  return NextResponse.json(product);
}
