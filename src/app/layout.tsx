import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Nav } from "@/components/Nav";
import { AppHeader } from "@/components/AppHeader";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Bigotes de Azúcar — Costos y ventas",
  description: "Control de insumos, costos y ganancias — Bigotes de Azúcar",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "Bigotes de Azúcar",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffaf5" },
    { media: "(prefers-color-scheme: dark)", color: "#1c1917" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('bigotes-theme');
    if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches))
      document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geist.variable} h-full`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-full antialiased">
        <div className="mx-auto flex min-h-full max-w-lg flex-col px-4 pb-24 pt-6 md:max-w-4xl md:pb-8">
          <AppHeader />
          <div className="hidden md:block">
            <Nav />
          </div>
          <main className="flex-1">{children}</main>
          <div className="md:hidden">
            <Nav />
          </div>
        </div>
      </body>
    </html>
  );
}
