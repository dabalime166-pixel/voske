"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IconBag, IconClose, IconMenu } from "./Icons";

const LINKS = [
  { href: "/admin", label: "Стол", match: (p: string) => p === "/admin" },
  {
    href: "/admin/orders",
    label: "Заказы",
    match: (p: string) => p.startsWith("/admin/orders"),
  },
  {
    href: "/admin/products",
    label: "Витрина",
    match: (p: string) =>
      p === "/admin/products" || (/^\/admin\/products\/[^/]+$/.test(p) && p !== "/admin/products/new"),
  },
  {
    href: "/admin/products/new",
    label: "Новое",
    match: (p: string) => p === "/admin/products/new",
  },
] as const;

function IconHome() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 10.5 12 4l8 6.5V20H4V10.5z" />
      <path d="M9 20v-6h6v6" />
    </svg>
  );
}

function IconBox() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M4 8l8-4 8 4-8 4-8-4z" />
      <path d="M4 8v8l8 4 8-4V8" />
      <path d="M12 12v8" />
    </svg>
  );
}

function IconPlus() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

const ICONS = [IconHome, IconBag, IconBox, IconPlus] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ok, setOk] = useState<boolean | null>(pathname === "/admin/login" ? true : null);
  const [unread, setUnread] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.replace("/admin/login");
  }

  if (pathname === "/admin/login") return <>{children}</>;
  if (!ok) {
    return (
      <div className="admin-shell flex min-h-screen items-center justify-center text-sm text-[var(--ink-soft)]">
        Проверяем доступ…
      </div>
    );
  }

  return (
    <div className="admin-shell">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 border-r border-[var(--line)] bg-white md:flex md:flex-col">
        <div className="border-b border-[var(--line)] px-6 py-6">
          <Link href="/admin" className="font-serif text-2xl tracking-[0.28em]">
            VOSKE
          </Link>
          <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-[var(--ink-soft)]">Админ</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {LINKS.map((link) => {
            const active = link.match(pathname);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center justify-between px-3 py-3 text-sm ${
                  active ? "bg-[#0b0b0b] text-white" : "text-[var(--ink-soft)] hover:bg-[var(--muted)] hover:text-[#0b0b0b]"
                }`}
              >
                <span>{link.label}</span>
                {link.href === "/admin/orders" && unread > 0 && (
                  <span className={`admin-badge ${active ? "bg-white text-[#0b0b0b]" : ""}`}>{unread}</span>
                )}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-[var(--line)] px-4 py-4">
          <Link href="/" className="block px-2 py-2 text-sm text-[var(--ink-soft)] hover:text-[#0b0b0b]">
            ← На сайт
          </Link>
          <button onClick={logout} className="w-full px-2 py-2 text-left text-sm text-[var(--ink-soft)] hover:text-[#0b0b0b]">
            Выйти
          </button>
        </div>
      </aside>

      <div className="md:pl-60">
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[var(--line)] bg-white/95 px-4 py-3 backdrop-blur md:hidden">
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center"
            onClick={() => setMenuOpen(true)}
            aria-label="Меню"
          >
            <IconMenu />
          </button>
          <Link href="/admin" className="font-serif text-lg tracking-[0.24em]">
            VOSKE
          </Link>
          <Link href="/admin/orders" className="relative flex h-11 w-11 items-center justify-center" aria-label="Заказы">
            <IconBag />
            {unread > 0 && <span className="admin-badge absolute right-1 top-1">{unread}</span>}
          </Link>
        </header>

        {menuOpen && (
          <div className="fixed inset-0 z-50 bg-black/30 md:hidden" onClick={() => setMenuOpen(false)}>
            <div className="h-full w-[78%] max-w-xs bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="mb-8 flex items-center justify-between">
                <span className="font-serif text-xl tracking-[0.24em]">VOSKE</span>
                <button type="button" className="flex h-10 w-10 items-center justify-center" onClick={() => setMenuOpen(false)}>
                  <IconClose />
                </button>
              </div>
              <nav className="flex flex-col gap-1">
                {LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-3 text-base ${link.match(pathname) ? "bg-[#0b0b0b] text-white" : ""}`}
                  >
                    {link.label}
                    {link.href === "/admin/orders" && unread > 0 ? ` · ${unread}` : ""}
                  </Link>
                ))}
              </nav>
              <div className="mt-10 space-y-2 border-t border-[var(--line)] pt-4">
                <Link href="/" className="block py-2 text-sm text-[var(--ink-soft)]">
                  Открыть сайт
                </Link>
                <button onClick={logout} className="py-2 text-sm text-[var(--ink-soft)]">
                  Выйти
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="px-4 py-5 sm:px-6 md:p-10">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t border-[var(--line)] bg-white/95 pb-[env(safe-area-inset-bottom,0px)] backdrop-blur md:hidden"
        aria-label="Админ-навигация"
      >
        {LINKS.map((link, i) => {
          const Icon = ICONS[i];
          const active = link.match(pathname);
          return (
            <Link key={link.href} href={link.href} className={`admin-nav-item ${active ? "is-active" : ""}`}>
              <span className="relative">
                <Icon />
                {link.href === "/admin/orders" && unread > 0 && (
                  <span className="admin-badge absolute -right-2 -top-1">{unread}</span>
                )}
              </span>
              {link.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
