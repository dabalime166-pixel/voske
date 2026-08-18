import { NextResponse } from "next/server";
import { SITE } from "@/lib/constants";
import { createOrder, getOrders, getProducts } from "@/lib/store";
import { isAdmin } from "@/lib/auth";
import type { CartItem, Order } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Нет доступа" }, { status: 401 });
  }
  const orders = await getOrders();
  return NextResponse.json(orders);
}

type CheckoutBody = {
  items: CartItem[];
  customer: Order["customer"];
  deliveryMethod: Order["deliveryMethod"];
  paymentMethod: Order["paymentMethod"];
};

export async function POST(request: Request) {
  const body = (await request.json()) as CheckoutBody;
  const { items, customer, deliveryMethod, paymentMethod } = body;
  if (!items?.length) {
    return NextResponse.json({ error: "Корзина пуста" }, { status: 400 });
  }
  const required = ["firstName", "lastName", "phone", "email", "city", "address"] as const;
  for (const key of required) {
    if (!customer?.[key]?.trim()) {
      return NextResponse.json({ error: "Заполните все поля покупателя" }, { status: 400 });
    }
  }

  try {
    const products = await getProducts();
    const orderItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) throw new Error("Товар больше не доступен");
      if (!product.inStock || product.stockCount < item.quantity) {
        throw new Error(`Недостаточно «${product.name}» на складе`);
      }
      return {
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: product.images[0] || "/images/voske-logo.jpg",
        price: product.price,
        quantity: item.quantity,
        size: item.size,
        metal: product.metal,
        purity: product.purity,
      };
    });

    const subtotal = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryPrice = deliveryMethod === "pickup" ? 0 : subtotal >= 25000 ? 0 : 790;
    const order = await createOrder({
      items: orderItems,
      subtotal,
      deliveryPrice,
      total: subtotal + deliveryPrice,
      customer: {
        ...customer,
        comment: customer.comment || "",
        country: customer.country || "russia",
      },
      deliveryMethod,
      paymentMethod,
    });

    return NextResponse.json({
      ...order,
      trackingPhone: SITE.trackingPhone,
      telegram: SITE.telegram,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Не удалось оформить заказ";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
