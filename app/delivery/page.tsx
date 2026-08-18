"use client";

import { useI18n } from "@/components/I18nProvider";

export default function DeliveryPage() {
  const { t } = useI18n();
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 leading-8">
      <h1 className="font-serif text-5xl">{t("delivery.title")}</h1>
      <p className="mt-6">{t("delivery.p1")}</p>
      <p className="mt-4">{t("delivery.p2")}</p>
      <p className="mt-4">{t("delivery.p3")}</p>
    </div>
  );
}
