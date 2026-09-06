"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import { User, UserRole } from "@/types/user";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole, userData?: Partial<User>) => void;
  isAuthenticated: boolean;
  login: (identifier: string, role?: UserRole) => void;
  logout: () => void;
}

const STORAGE_KEY = "localspotter-user";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

const readStoredUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
};

const buildUser = (identifier: string, role: UserRole): User => {
  const trimmed = identifier.trim();
  const email = trimmed.includes("@") ? trimmed : `${trimmed}@localspotter.nl`;
  const displayName = trimmed.includes("@")
    ? trimmed.split("@")[0].replace(/[._-]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase())
    : trimmed.replace(/\s+/g, " ").trim() || "Local Spotter User";

  return {
    id: `user-${Math.random().toString(36).slice(2, 10)}`,
    name: displayName,
    email,
    role,
    createdAt: new Date().toISOString(),
  };
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>(() => readStoredUser()?.role ?? "PUBLIC");
  const [user, setUser] = useState<User | null>(() => readStoredUser());

  const syncUserState = (nextRole: UserRole, nextUser: User | null) => {
    setRoleState(nextRole);
    setUser(nextUser);

    if (typeof window !== "undefined") {
      if (!nextUser) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    }
  };

  const setRole = (newRole: UserRole, userData?: Partial<User>) => {
    if (newRole === "PUBLIC") {
      syncUserState("PUBLIC", null);
      return;
    }

    const previousUser = user ?? readStoredUser();
    const nextUser = {
      id: userData?.id ?? previousUser?.id ?? `user-${Math.random().toString(36).slice(2, 10)}`,
      name: userData?.name ?? previousUser?.name ?? "Local Spotter User",
      email: userData?.email ?? previousUser?.email ?? "user@localspotter.nl",
      phone: userData?.phone ?? previousUser?.phone,
      role: newRole,
      avatarUrl: userData?.avatarUrl ?? previousUser?.avatarUrl,
      createdAt: userData?.createdAt ?? previousUser?.createdAt ?? new Date().toISOString(),
    } satisfies User;

    syncUserState(newRole, nextUser);
  };

  const login = (identifier: string, selectedRole: UserRole = "CONSUMER") => {
    const trimmedIdentifier = identifier.trim();
    if (!trimmedIdentifier) {
      syncUserState("PUBLIC", null);
      return;
    }

    const nextUser = buildUser(trimmedIdentifier, selectedRole);
    syncUserState(selectedRole, nextUser);
  };

  const logout = () => {
    syncUserState("PUBLIC", null);
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      role,
      setRole,
      isAuthenticated: role !== "PUBLIC",
      login,
      logout,
    }),
    [role, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
