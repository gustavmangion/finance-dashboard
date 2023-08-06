"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode } from "react";

export default function Provider({ children }: { children: React.ReactNode }) {
	return <SessionProvider>{children}</SessionProvider>;
}
