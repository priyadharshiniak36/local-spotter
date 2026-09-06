"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, MapPin, Calendar, User, Store } from "lucide-react";
import { useAuth } from "@/features/auth/AuthContext";

export const BottomNav: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuth();

  // Custom nav items depending on role
  const isOwner = role === "BUSINESS_OWNER";

  const consumerItems = [
    { label: "Discover", href: "/", icon: ShoppingBag },
    { label: "Shop Routes", href: "/shoproutes", icon: MapPin },
    { label: "Workshops", href: "/workshops", icon: Calendar },
    { label: "Account", href: "/account", icon: User },
  ];

  const ownerItems = [
    { label: "My Shop", href: "/owner", icon: Store },
    { label: "Orders", href: "/owner/orders", icon: ShoppingBag },
    { label: "Workshops", href: "/owner/workshop-bookings", icon: Calendar },
    { label: "Location", href: "/owner/shoproutes/location", icon: MapPin },
  ];

  const items = isOwner ? ownerItems : consumerItems;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 ls-bottom-nav h-[97px] px-6 flex items-center justify-around">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className="flex flex-col items-center justify-center gap-1 w-16 group"
          >
            <div className="relative p-1">
              <Icon
                className={`w-6 h-6 transition-colors ${
                  isActive ? "text-[#EA89B1]" : "text-[#B7B7B7] group-hover:text-[#0A182E]"
                }`}
              />
              {/* Active dot indicator from Figma */}
              {isActive && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-[#EA89B1] rounded-full" />
              )}
            </div>
            <span
              className={`text-[11px] font-medium transition-colors ${
                isActive ? "text-[#EA89B1] font-bold" : "text-[#B7B7B7]"
              }`}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};
