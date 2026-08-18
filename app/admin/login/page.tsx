"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) {
      setError("Неверный пароль");
      return;
    }
    router.replace("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#120e0b] px-4 text-[var(--cream)]">
      <form onSubmit={submit} className="w-full max-w-sm border border-[var(--gold)]/40 p-8">
        <p className="font-serif text-center text-4xl tracking-[0.3em]">VOSKE</p>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.28em] text-[var(--gold)]">Вход в дом</p>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Пароль"
          className="mt-8 w-full border border-white/20 bg-transparent px-3 py-3 outline-none"
        />
        {error && <p className="mt-3 text-sm text-[var(--pomegranate)]">{error}</p>}
        <button className="mt-6 w-full bg-[var(--gold)] py-3 text-sm uppercase tracking-[0.2em] text-[var(--ink)]">
          Войти
        </button>
        <p className="mt-4 text-center text-xs text-white/40">Пароль по умолчанию: voske2026</p>
      </form>
    </div>
  );
}
