import type { Category, Gender, MetalColor, Origin } from "./types";

export const SITE = {
  name: "VOSKE",
  nameHy: "ՈՍԿԵ",
  tagline: "Золотой дом России и Армении",
  taglineHy: "Ոսկու տուն Ռուսաստանի և Հայաստանի համար",
  trackingPhone: "099054713",
  trackingPhoneDisplay: "099 054 713",
  telegram: "themoonberry",
  telegramUrl: "https://t.me/themoonberry",
  email: "hello@voske.gold",
  cities: ["Ереван", "Москва", "Санкт-Петербург", "Краснодар", "Гюмри"],
} as const;

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "voske2026";
export const ADMIN_SECRET = process.env.ADMIN_SECRET || "voske-admin-secret-key";

export const CATEGORIES: { id: Category; label: string; labelHy: string }[] = [
  { id: "rings", label: "Кольца", labelHy: "Մատանիներ" },
  { id: "earrings", label: "Серьги", labelHy: "Ականջօղեր" },
  { id: "necklaces", label: "Колье", labelHy: "Վզնոցներ" },
  { id: "pendants", label: "Подвески", labelHy: "Կախազարդեր" },
  { id: "bracelets", label: "Браслеты", labelHy: "Ապարանջաններ" },
  { id: "chains", label: "Цепи", labelHy: "Շղթաներ" },
  { id: "crosses", label: "Кресты", labelHy: "Խաչեր" },
  { id: "wedding", label: "Свадебные", labelHy: "Հարսանեկան" },
  { id: "kids", label: "Детские", labelHy: "Մանկական" },
];

export const METALS: { id: MetalColor; label: string }[] = [
  { id: "yellow", label: "Жёлтое золото" },
  { id: "white", label: "Белое золото" },
  { id: "rose", label: "Красное золото" },
  { id: "lemon", label: "Лимонное золото" },
  { id: "mixed", label: "Комбинированное" },
];

export const PURITIES = [375, 585, 750, 999] as const;

export const GENDERS: { id: Gender; label: string }[] = [
  { id: "women", label: "Женские" },
  { id: "men", label: "Мужские" },
  { id: "unisex", label: "Унисекс" },
  { id: "kids", label: "Детские" },
];

export const ORIGINS: { id: Origin; label: string }[] = [
  { id: "armenia", label: "Армения" },
  { id: "russia", label: "Россия" },
];

export const COLLECTIONS = [
  "Армянское наследие",
  "Русская классика",
  "Свадебная",
  "Мужской характер",
  "Детская радость",
  "Сияние камней",
] as const;

export const RING_SIZES = ["15", "15.5", "16", "16.5", "17", "17.5", "18", "18.5", "19", "19.5", "20", "21"];
export const CHAIN_LENGTHS = ["40", "45", "50", "55", "60"];
export const BRACELET_SIZES = ["16", "17", "18", "19", "20", "21"];
