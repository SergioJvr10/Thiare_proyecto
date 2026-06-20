"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/materiales", label: "Insumos", icon: "📦" },
  { href: "/compras", label: "Compras", icon: "🛒" },
  { href: "/productos", label: "Productos", icon: "🧁" },
  { href: "/ventas", label: "Ventas", icon: "💰" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-rose-200/80 bg-white/95 backdrop-blur-md pb-[env(safe-area-inset-bottom)] md:static md:border-t-0 md:bg-transparent md:pb-0 dark:border-stone-700 dark:bg-stone-900/95 md:dark:bg-transparent">
      <ul className="mx-auto flex max-w-lg items-stretch justify-around md:max-w-4xl md:justify-center md:gap-2">
        {links.map((link) => {
          const active =
            link.href === "/"
              ? pathname === "/"
              : pathname.startsWith(link.href);
          return (
            <li key={link.href} className="flex-1 md:flex-none">
              <Link
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-2 py-3 text-xs font-medium transition-colors md:flex-row md:rounded-full md:px-4 md:py-2 md:text-sm ${
                  active
                    ? "text-amber-700 dark:text-amber-400"
                    : "text-stone-500 hover:text-amber-600 dark:hover:text-amber-400"
                }`}
              >
                <span className="text-lg md:text-base" aria-hidden>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
