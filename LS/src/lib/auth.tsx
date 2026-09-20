import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, Role } from "./store";
import { getUserByEmail } from "./store";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => { success: boolean; error?: string };
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Demo passwords (prototype only)
const DEMO_PASSWORDS: Record<string, string> = {
  "inspector@labelsure.gov.in": "inspect123",
  "manufacturer@labelsure.com": "mfr123",
  "consumer@labelsure.com": "consumer123",
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = sessionStorage.getItem("ls_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, password: string) => {
    const found = getUserByEmail(email);
    if (!found) return { success: false, error: "No account found with this email." };
    const expected = DEMO_PASSWORDS[email.toLowerCase()];
    if (password !== expected) return { success: false, error: "Incorrect password." };
    setUser(found);
    sessionStorage.setItem("ls_user", JSON.stringify(found));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("ls_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export function getRoleBasePath(role: Role): string {
  switch (role) {
    case "inspector": return "/enforce";
    case "manufacturer": return "/prevent";
    case "consumer": return "/verify";
  }
}
