import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "English A2 Quiz - Making Friends",
  description: "Cuestionario interactivo de inglés nivel A2 sobre el tema 'Making Friends'. Mejora tu vocabulario y gramática con ejercicios de traducción, opción múltiple y más.",
  keywords: ["inglés", "A2", "cuestionario", "making friends", "vocabulario", "gramática"],
  authors: [{ name: "English Learning Platform" }],
  openGraph: {
    title: "English A2 Quiz - Making Friends",
    description: "Cuestionario interactivo de inglés nivel A2 sobre el tema 'Making Friends'",
    type: "website",
    locale: "es_ES",
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#0ea5e9" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} dark`}>
      <body className={`${inter.className} antialiased bg-dark-900 text-slate-100`}>
        {children}
      </body>
    </html>
  );
}
