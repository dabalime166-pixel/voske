"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const LINKS = [
  { href: "/admin", label: "Стол" },
  { href: "/admin/orders", label: "Заказы" },
  { href: "/admin/products", label: "Витрина" },
  { href: "/admin/products/new", label: "Новое изделие" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(pathname === "/admin/login" ? true : null);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/admin/session")
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) router.replace("/admin/login");
        else setOk(true);
      });
  }, [pathname, router]);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => setUnread(d.unread || 0))
      .catch(() => undefined);
  }, [pathname]);

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!ok) return <div className="dark-panel min-h-screen p-10">Проверяем доступ...</div>;

  return (
    <div className="min-h-screen bg-[#1a1510] text-[var(--cream)]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 p-6 md:block">
        <Link href="/" className="font-serif text-3xl tracking-[0.28em]">
          VOSKE
        </Link>
        <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[var(--gold)]">Админ-дом</p>
        <nav className="mt-10 flex flex-col gap-3 text-sm uppercase tracking-[0.16em]">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={pathname === link.href ? "text-[var(--gold)]" : "text-white/70 hover:text-white"}>
              {link.label}
              {link.href === "/admin/orders" && unread > 0 && (
                <span className="notice-pulse ml-2 inline-block rounded-full bg-[var(--pomegranate)] px-2 py-0.5 text-[10px] text-white">
                  {unread}
                </span>
              )}
            </Link>
          ))}
        </nav>
        <button onClick={logout} className="mt-12 text-xs uppercase tracking-[0.18em] text-white/40">
          Выйти
        </button>
      </aside>
      <div className="md:pl-64">
        <header className="flex items-center justify-between border-b border-white/10 px-6 py-4 md:hidden">
          <span className="font-serif tracking-[0.2em]">VOSKE ADMIN</span>
          {unread > 0 && <span className="text-[var(--gold)]">{unread} новых</span>}
        </header>
        <div className="p-6 md:p-10">{children}</div>
      </div>
    </div>
  );
}
