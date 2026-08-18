import { promises as fs } from "fs";
import path from "path";
import type { GoldSnapshot, Order, Product, ProductInput } from "./types";
import { seedProducts } from "./seed-products";
import { SITE } from "./constants";

const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "voske-data")
  : path.join(process.cwd(), "data");
const PRODUCTS_FILE = path.join(DATA_DIR, "products.json");
const ORDERS_FILE = path.join(DATA_DIR, "orders.json");
const GOLD_FILE = path.join(DATA_DIR, "gold.json");

type Cache = {
  products?: Product[];
  orders?: Order[];
  gold?: GoldSnapshot | null;
};

const cache: Cache = {};
let lock: Promise<void> = Promise.resolve();

async function ensureDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, data: unknown) {
  try {
    await ensureDir();
    const tmp = `${file}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmp, file);
  } catch {
    /* On serverless, keep the in-memory cache if disk write fails. */
  }
}

function withLock<T>(fn: () => Promise<T>) {
  const run = lock.then(fn, fn);
  lock = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

export async function getProducts() {
  if (!cache.products) {
    const stored = await readJson<Product[] | null>(PRODUCTS_FILE, null);
    cache.products = stored && stored.length ? stored : seedProducts();
    if (!stored || !stored.length) await writeJson(PRODUCTS_FILE, cache.products);
  }
  return cache.products;
}

export async function getProduct(idOrSlug: string) {
  const products = await getProducts();
  return products.find((p) => p.id === idOrSlug || p.slug === idOrSlug) ?? null;
}

export async function saveProduct(input: ProductInput) {
  return withLock(async () => {
    const products = await getProducts();
    const now = new Date().toISOString();
    if (input.id) {
      const index = products.findIndex((p) => p.id === input.id);
      if (index === -1) throw new Error("Товар не найден");
      const prev = products[index];
      products[index] = {
        ...prev,
        ...input,
        id: prev.id,
        rating: input.rating ?? prev.rating,
        reviewCount: input.reviewCount ?? prev.reviewCount,
        reviews: input.reviews ?? prev.reviews,
        updatedAt: now,
      };
    } else {
      const product: Product = {
        rating: 5,
        reviewCount: 0,
        reviews: [],
        ...input,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now,
      };
      products.unshift(product);
    }
    cache.products = products;
    await writeJson(PRODUCTS_FILE, products);
    return products.find((p) => p.slug === input.slug)!;
  });
}

export async function deleteProduct(id: string) {
  return withLock(async () => {
    const products = await getProducts();
    const next = products.filter((p) => p.id !== id);
    if (next.length === products.length) throw new Error("Товар не найден");
    cache.products = next;
    await writeJson(PRODUCTS_FILE, next);
  });
}

export async function getOrders() {
  if (!cache.orders) {
    cache.orders = await readJson<Order[]>(ORDERS_FILE, []);
  }
  return cache.orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getOrder(id: string) {
  const orders = await getOrders();
  return orders.find((o) => o.id === id || o.number === id) ?? null;
}

export async function createOrder(
  payload: Omit<Order, "id" | "number" | "createdAt" | "status" | "read" | "trackingPhone">,
) {
  return withLock(async () => {
    const orders = await getOrders();
    const seq = String(orders.length + 1).padStart(4, "0");
    const order: Order = {
      ...payload,
      id: crypto.randomUUID(),
      number: `VOSKE-${seq}`,
      createdAt: new Date().toISOString(),
      status: "new",
      read: false,
      trackingPhone: SITE.trackingPhone,
    };
    orders.unshift(order);
    cache.orders = orders;
    await writeJson(ORDERS_FILE, orders);

    const products = await getProducts();
    for (const item of order.items) {
      const product = products.find((p) => p.id === item.productId);
      if (product) {
        product.stockCount = Math.max(0, product.stockCount - item.quantity);
        product.inStock = product.stockCount > 0;
        product.updatedAt = order.createdAt;
      }
    }
    cache.products = products;
    await writeJson(PRODUCTS_FILE, products);
    return order;
  });
}

export async function updateOrder(id: string, patch: Partial<Pick<Order, "status" | "read">>) {
  return withLock(async () => {
    const orders = await getOrders();
    const order = orders.find((o) => o.id === id);
    if (!order) throw new Error("Заказ не найден");
    Object.assign(order, patch);
    cache.orders = orders;
    await writeJson(ORDERS_FILE, orders);
    return order;
  });
}

export async function unreadOrdersCount() {
  const orders = await getOrders();
  return orders.filter((o) => !o.read).length;
}

export async function getGold() {
  if (cache.gold === undefined) {
    cache.gold = await readJson<GoldSnapshot | null>(GOLD_FILE, null);
  }
  return cache.gold;
}

export async function saveGold(snapshot: GoldSnapshot) {
  return withLock(async () => {
    cache.gold = snapshot;
    await writeJson(GOLD_FILE, snapshot);
    return snapshot;
  });
}

export async function resetCatalog() {
  return withLock(async () => {
    cache.products = seedProducts();
    await writeJson(PRODUCTS_FILE, cache.products);
    return cache.products;
  });
}
