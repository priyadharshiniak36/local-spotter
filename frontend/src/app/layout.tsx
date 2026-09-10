import type { Metadata } from "next";
import { AuthProvider } from "@/features/auth/AuthContext";
import { CartProvider } from "@/features/cart/CartContext";
import { LocaleProvider } from "@/i18n/LocaleContext";
import { ShopJoinWidget } from "@/components/widgets/ShopJoinWidget";
import "./globals.css";

export const metadata: Metadata = {
  title: "LocalSpotter.nl — Ontdek Lokale Winkels & Shoproutes",
  description: "Het platform voor lokale winkels, ambachtelijke producten, shoproutes en creatieve workshops in Nederland.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="nl">
      <body>
        <LocaleProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </LocaleProvider>
        {/* Floating "Join as a shop" popup — shown on every page */}
        <ShopJoinWidget />
      </body>
    </html>
  );
}
