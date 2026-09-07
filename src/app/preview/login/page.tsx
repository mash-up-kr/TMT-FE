"use client";

import { useState } from "react";
import { LoginScreen } from "@/app/login/_components/LoginScreen";

export default function LoginPreviewPage() {
  const [pending, setPending] = useState(false);
  return <LoginScreen loading={pending} onLogin={() => setPending(true)} />;
}
