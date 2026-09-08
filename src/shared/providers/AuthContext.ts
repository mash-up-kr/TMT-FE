"use client";

import { createContext } from "react";
import type { announceLogin, getSessionSnapshot, logoutSession } from "@/api/auth-session";

type AuthContextValue = ReturnType<typeof getSessionSnapshot> & {
  profileCompleted: boolean | null;
  logout: typeof logoutSession;
  announceLogin: typeof announceLogin;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
