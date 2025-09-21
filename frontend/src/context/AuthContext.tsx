"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

type Role = "USER" | "ADMIN";
type User = { id: number; username: string; role: Role };

type AuthCtx = {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const u = typeof window !== "undefined" ? localStorage.getItem("user") : null;
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        localStorage.removeItem("user");
      }
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      token,
      login: (t: string, u: User) => {
        setToken(t);
        setUser(u);
        localStorage.setItem("token", t);
        localStorage.setItem("user", JSON.stringify(u));
      },
      logout: () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      },
    }),
    [user, token]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}

