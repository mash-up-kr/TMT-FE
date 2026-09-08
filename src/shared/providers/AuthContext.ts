"use client";

import { createContext } from "react";
import type { announceLogin, logoutSession } from "@/api/auth-session";
import type { AuthState } from "./authState";

type AuthContextValue = {
  state: AuthState;
  logout: typeof logoutSession;
  announceLogin: typeof announceLogin;
};

export const AuthContext = createContext<AuthContextValue | null>(null);
