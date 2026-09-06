"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ShoppingBag, MapPin, Calendar, Store, ShieldCheck } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export const TopNav: React.FC = () => {
  const pathname = usePathname();
  const { user, role, isAuthenticated } = useAuth();

  const navLinks = [
    { label: "Products", href: "/products", icon: ShoppingBag },
    { label: "Local Shops", href: "/businesses", icon: Store },
    { label: "Shop Routes", href: "/shoproutes", icon: MapPin },
    { label: "Workshops", href: "/workshops", icon: Calendar },
  ];

  return (
    <nav className="hidden md:block bg-[#FCE1F0] border-b border-[#F4D0E2] sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
          <img
            src="/logo.png"
            alt="LocalSpotter Logo"
            className="h-10 md:h-11 w-auto object-contain"
          />
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-1 bg-white/70 p-1.5 rounded-full border border-white/50 shadow-2xs">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isActive
                    ? "bg-[#0A182E] text-white shadow-xs"
                    : "text-[#0A182E] hover:bg-white/80"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* User / Dashboard Action */}
        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="p-2 rounded-full bg-white/80 hover:bg-white transition-colors relative shadow-2xs"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#0A182E]" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#EA89B1] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
              1
            </span>
          </Link>

          {role === "BUSINESS_OWNER" && (
            <Link
              href="/owner"
              className="px-4 py-2 rounded-xl bg-[#0A182E] text-white text-xs font-bold hover:bg-[#152744] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Store className="w-4 h-4 text-[#FBBC3E]" />
              Business Dashboard
            </Link>
          )}

          {role === "SUPER_ADMIN" && (
            <Link
              href="/admin"
              className="px-4 py-2 rounded-xl bg-[#0A182E] text-white text-xs font-bold hover:bg-[#152744] transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4 text-[#EA89B1]" />
              Admin
            </Link>
          )}

          {!isAuthenticated ? (
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl bg-[#EA89B1] text-white text-xs font-bold hover:bg-[#D977A0] transition-colors shadow-xs"
            >
              Login
            </Link>
          ) : (
            <Link
              href="/account"
              className="flex items-center gap-2 p-1.5 pr-3 bg-white rounded-full border border-white/80 shadow-xs hover:border-[#EA89B1] transition-all"
            >
              <div className="w-7 h-7 rounded-full bg-[#0A182E] text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0)}
              </div>
              <span className="text-xs font-bold text-[#0A182E]">{user?.name}</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
