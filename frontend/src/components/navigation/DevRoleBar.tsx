"use client";

import React from "react";
import { useAuth } from "@/features/auth/AuthContext";
import { UserRole } from "@/types/user";

export const DevRoleBar: React.FC = () => {
  const { role, setRole, user } = useAuth();

  const roles: { role: UserRole; label: string }[] = [
    { role: "PUBLIC", label: "Bezoeker (Public)" },
    { role: "CONSUMER", label: "Consument (Koper)" },
    { role: "BUSINESS_OWNER", label: "Winkelier (Verkoper)" },
    { role: "SUPER_ADMIN", label: "Super Admin" },
  ];

  return (
    <div className="bg-[#121F3E] text-white text-xs py-1.5 px-4 flex items-center justify-between z-50 relative select-none">
      <div className="flex items-center gap-2">
        <span className="bg-[#FA1EFF] text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
          DEV PREVIEW
        </span>
        <span className="text-gray-300 hidden sm:inline">
          Rol inzien: <strong className="text-white">{role}</strong>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {roles.map((r) => (
          <button
            key={r.role}
            onClick={() => setRole(r.role)}
            className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
              role === r.role
                ? "bg-[#FA1EFF] text-white shadow-xs"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            {r.label}
          </button>
        ))}
      </div>
    </div>
  );
};
