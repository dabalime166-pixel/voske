import { SITE } from "@/lib/constants";

export default function ContactsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-8">
      <p className="text-xs uppercase tracking-[0.3em] text-[var(--gold-deep)]">Контакты</p>
      <h1 className="font-serif text-5xl">Дом на связи</h1>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div className="panel rounded-2xl p-8">
          <h2 className="font-serif text-2xl">Поддержка</h2>
          <p className="mt-3 leading-8">Telegram — самый быстрый путь к консультанту VOSKE.</p>
          <a href={SITE.telegramUrl} className="mt-4 inline-block bg-[var(--ink)] px-5 py-3 text-sm uppercase tracking-[0.16em] text-[var(--cream)]" target="_blank" rel="noreferrer">
            @{SITE.telegram}
          </a>
        </div>
        <div className="panel rounded-2xl p-8">
          <h2 className="font-serif text-2xl">Отслеживание заказа</h2>
          <p className="mt-3 leading-8">Назовите номер заказа VOSKE-**** и город доставки.</p>
          <a href={`tel:${SITE.trackingPhone}`} className="font-serif mt-4 block text-3xl">
            {SITE.trackingPhoneDisplay}
          </a>
        </div>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="font-serif text-2xl">Ереван</h3>
          <p className="mt-2 text-[var(--ink-soft)]">Северный проспект, ювелирный квартал · 11:00–20:00</p>
        </div>
        <div>
          <h3 className="font-serif text-2xl">Москва</h3>
          <p className="mt-2 text-[var(--ink-soft)]">Садовое кольцо, салон-витрина · 11:00–21:00</p>
        </div>
      </div>
    </div>
  );
}
