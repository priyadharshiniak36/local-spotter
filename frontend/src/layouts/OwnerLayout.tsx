"use client";

import React from "react";
import { TopNav } from "@/components/navigation/TopNav";
import { AppHeader } from "@/components/navigation/AppHeader";
import { BottomNav } from "@/components/navigation/BottomNav";
import { OwnerSidebar } from "@/components/navigation/OwnerSidebar";
import { DevRoleBar } from "@/components/navigation/DevRoleBar";

export const OwnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9F9F9]">
      <DevRoleBar />
      <div className="md:hidden">
        <AppHeader title="Ondernemer Portal" />
      </div>
      <TopNav />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <OwnerSidebar />
        <main className="flex-1 p-4 md:p-8 pb-28 md:pb-12 w-full overflow-x-hidden">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
