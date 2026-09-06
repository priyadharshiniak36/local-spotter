"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User, UserRole } from "@/types/user";

interface AuthContextType {
  user: User | null;
  role: UserRole;
  setRole: (role: UserRole) => void;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>("PUBLIC");
  const [user, setUser] = useState<User | null>(null);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === "PUBLIC") {
      setUser(null);
    } else {
      setUser({
        id: "mock-user-1",
        name: newRole === "BUSINESS_OWNER" ? "Karel (Bag Shop)" : newRole === "SUPER_ADMIN" ? "Admin LocalSpotter" : "Sanne de Jong",
        email: newRole === "BUSINESS_OWNER" ? "karel@bagshop-horn.nl" : "sanne@example.nl",
        role: newRole,
        avatarUrl: newRole === "CONSUMER" ? "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" : undefined,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const login = (email: string, selectedRole: UserRole = "CONSUMER") => {
    setRole(selectedRole);
  };

  const logout = () => {
    setRole("PUBLIC");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        setRole,
        isAuthenticated: role !== "PUBLIC",
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
