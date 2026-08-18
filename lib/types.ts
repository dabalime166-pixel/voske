export type MetalColor = "yellow" | "white" | "rose" | "lemon" | "mixed";
export type Category =
  | "rings"
  | "earrings"
  | "necklaces"
  | "bracelets"
  | "chains"
  | "crosses"
  | "pendants"
  | "wedding"
  | "kids";
export type Gender = "women" | "men" | "unisex" | "kids";
export type Origin = "russia" | "armenia";
export type Purity = 375 | 585 | 750 | 999;

export type Review = {
  author: string;
  rating: number;
  text: string;
  date: string;
  city: string;
};

export type Product = {
  id: string;
  sku: string;
  slug: string;
  name: string;
  nameHy: string;
  nameEn?: string;
  description: string;
  descriptionHy?: string;
  descriptionEn?: string;
  price: number;
  oldPrice?: number;
  category: Category;
  metal: MetalColor;
  purity: Purity;
  weight: number;
  gender: Gender;
  sizes: string[];
  stones: string[];
  collection: string;
  origin: Origin;
  inspiredBy: string;
  inStock: boolean;
  stockCount: number;
  isHit: boolean;
  isNew: boolean;
  images: string[];
  article: string;
  warrantyMonths: number;
  rating: number;
  reviewCount: number;
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
};

export type CartItem = {
  productId: string;
  quantity: number;
  size?: string;
};

export type OrderItem = {
  productId: string;
  name: string;
  sku: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  metal: MetalColor;
  purity: Purity;
};

export type OrderStatus =
  | "new"
  | "confirmed"
  | "processing"
  | "shipped"
  | "completed"
  | "cancelled";

export type Order = {
  id: string;
  number: string;
  createdAt: string;
  status: OrderStatus;
  read: boolean;
  items: OrderItem[];
  subtotal: number;
  deliveryPrice: number;
  total: number;
  customer: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    country: "russia" | "armenia";
    city: string;
    address: string;
    comment: string;
  };
  deliveryMethod: "courier" | "pickup" | "cdek";
  paymentMethod: "cod" | "card" | "transfer";
  trackingPhone: string;
};

export type GoldSnapshot = {
  updatedAt: string;
  source: string;
  xauUsdPerOz: number;
  usdRub: number;
  usdAmd: number;
  perGram: {
    "999": { rub: number; amd: number; usd: number };
    "750": { rub: number; amd: number; usd: number };
    "585": { rub: number; amd: number; usd: number };
    "375": { rub: number; amd: number; usd: number };
  };
};

export type ProductInput = Omit<
  Product,
  "id" | "createdAt" | "updatedAt" | "rating" | "reviewCount" | "reviews"
> & {
  id?: string;
  rating?: number;
  reviewCount?: number;
  reviews?: Review[];
};
