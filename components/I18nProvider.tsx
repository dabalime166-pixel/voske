"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  DATE_LOCALE,
  DICTS,
  LOCALE_STORAGE,
  type Locale,
  interpolate,
} from "@/lib/i18n";

type I18nValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, vars?: Record<string, string | number>) => string;
  dateLocale: string;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("ru");

  useEffect(() => {
    const stored = localStorage.getItem(LOCALE_STORAGE) as Locale | null;
    if (stored && DICTS[stored]) setLocaleState(stored);
  }, []);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    localStorage.setItem(LOCALE_STORAGE, next);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "hy" ? "hy" : locale;
    document.documentElement.dataset.locale = locale;
  }, [locale]);

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const table = DICTS[locale];
      return interpolate(table[key] || DICTS.ru[key] || key, vars);
    },
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, t, dateLocale: DATE_LOCALE[locale] }),
    [locale, setLocale, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("I18nProvider missing");
  return ctx;
}

export function LanguageSwitch({ compact = false }: { compact?: boolean }) {
  const { locale, setLocale } = useI18n();
  const items: Locale[] = ["ru", "hy", "en"];
  const labels: Record<Locale, string> = { ru: "RU", hy: "ՀԱ", en: "EN" };
  return (
    <div className={`lang-switch ${compact ? "lang-switch-sm" : ""}`} role="radiogroup" aria-label="Language">
      {items.map((id) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={locale === id}
          className={locale === id ? "is-active" : ""}
          onClick={() => setLocale(id)}
        >
          {labels[id]}
        </button>
      ))}
    </div>
  );
}
