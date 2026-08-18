import Link from "next/link";

export default function NotFound() {
  return (
    <div className="px-8 py-24 text-center">
      <p className="font-serif text-6xl">404</p>
      <p className="mt-4">Этой витрины нет в доме VOSKE.</p>
      <Link href="/" className="mt-6 inline-block border border-[var(--ink)] px-6 py-3 text-sm uppercase tracking-[0.16em]">
        На главную
      </Link>
    </div>
  );
}
