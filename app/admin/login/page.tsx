"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setPending(true);
    setError("");
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Неверный пароль");
      return;
    }
    router.replace("/admin");
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#f7f7f5] px-4 py-10">
      <form onSubmit={submit} className="admin-card w-full max-w-sm p-6 sm:p-8">
        <p className="font-serif text-center text-3xl tracking-[0.28em] sm:text-4xl">VOSKE</p>
        <p className="mt-2 text-center text-[11px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">Вход в админку</p>
        <label className="mt-8 block text-sm text-[var(--ink-soft)]">
          Пароль
          <input
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="admin-field mt-2"
            placeholder="••••••••"
          />
        </label>
        {error && <p className="mt-3 text-sm text-[var(--pomegranate)]">{error}</p>}
        <button type="submit" disabled={pending} className="admin-btn admin-btn-primary mt-6 w-full disabled:opacity-50">
          {pending ? "Входим…" : "Войти"}
        </button>
        <p className="mt-4 text-center text-xs text-[var(--ink-soft)]">По умолчанию: voske2026</p>
        <Link href="/" className="mt-6 block text-center text-sm text-[var(--ink-soft)] underline underline-offset-4">
          На сайт
        </Link>
      </form>
    </div>
  );
}
