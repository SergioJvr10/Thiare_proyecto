import { ThemeToggle } from "@/components/ThemeToggle";

export function AppHeader() {
  return (
    <header className="relative mb-4 text-center md:mb-6">
      <div className="absolute right-0 top-0">
        <ThemeToggle />
      </div>
      <p className="text-xs font-semibold uppercase tracking-widest text-amber-700 dark:text-amber-400">
        Bigotes de Azúcar
      </p>
      <p className="text-sm text-stone-600 dark:text-stone-400">
        Costos, ventas y ganancias
      </p>
    </header>
  );
}
