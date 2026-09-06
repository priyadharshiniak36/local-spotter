"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

type Locale = "en" | "nl";

const COOKIE_NAME = "localspotter-locale";

const getPreferredLocale = (): Locale => {
  if (typeof window === "undefined") {
    return "en";
  }

  const cookieValue = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${COOKIE_NAME}=`));

  if (cookieValue) {
    const value = cookieValue.split("=")[1];
    if (value === "en" || value === "nl") {
      return value;
    }
  }

  const browserLocale = navigator.language.toLowerCase();
  return browserLocale.startsWith("nl") ? "nl" : "en";
};

const setLocaleCookie = (locale: Locale) => {
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
  localStorage.setItem(COOKIE_NAME, locale);
};

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  onMenuClick?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  showBack = false,
  onMenuClick,
}) => {
  const { user, isAuthenticated, role } = useAuth();
  const [locale, setLocale] = useState<Locale>("en");

  useEffect(() => {
    const initialLocale = getPreferredLocale();
    setLocale(initialLocale);
    document.documentElement.lang = initialLocale;
  }, []);

  const toggleLocale = () => {
    const nextLocale = locale === "en" ? "nl" : "en";
    setLocale(nextLocale);
    setLocaleCookie(nextLocale);
    document.documentElement.lang = nextLocale;
  };

  const localeLabel = useMemo(() => (locale === "en" ? "EN" : "NL"), [locale]);

  return (
    <header className="w-full bg-[#FCE1F0] pt-4 pb-4 px-4 shadow-2xs border-b border-[#F4D0E2] relative z-30">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-full hover:bg-black/5 transition-colors focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-[#0A182E]" />
          </button>

          <Link href="/" className="flex items-center gap-2 shrink-0 hover:opacity-90 transition-opacity">
            <img
              src="/logo.png"
              alt="LocalSpotter Logo"
              className="h-8 sm:h-9 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleLocale}
            className="inline-flex items-center justify-center rounded-full border border-[#0A182E]/10 bg-white/70 px-2.5 py-1 text-[10px] font-black tracking-[0.12em] text-[#0A182E] shadow-sm transition hover:border-[#FA1EFF]/50"
            aria-label="Toggle language"
          >
            {localeLabel}
          </button>

          <Link
            href="/cart"
            className="p-2 rounded-full hover:bg-black/5 transition-colors relative"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-5 h-5 text-[#0A182E]" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#EA89B1] rounded-full" />
          </Link>

          {isAuthenticated ? (
            <Link
              href={role === "BUSINESS_OWNER" ? "/owner" : role === "SUPER_ADMIN" ? "/admin" : "/account"}
              className="flex items-center gap-2 p-1 pl-2 bg-white/80 backdrop-blur-sm rounded-full border border-white/60 shadow-2xs"
            >
              <span className="text-xs font-bold text-[#0A182E] max-w-[90px] truncate hidden sm:inline">
                {user?.name}
              </span>
              <div className="w-7 h-7 rounded-full bg-[#0A182E] text-white flex items-center justify-center text-xs font-bold">
                {user?.name?.charAt(0) || "U"}
              </div>
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-xs font-bold text-white bg-[#EA89B1] px-4 py-1.5 rounded-full shadow-2xs hover:bg-[#D977A0] transition-all"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {title && (
        <div className="mt-3 text-center">
          <h1 className="text-xl font-bold font-rubik text-[#111111]">{title}</h1>
        </div>
      )}
    </header>
  );
};
