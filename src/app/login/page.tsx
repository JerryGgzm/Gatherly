import type { Metadata } from "next";
import { LoginView } from "@/components/flow/AuthViews";
import { safeNext } from "@/lib/next";

export const metadata: Metadata = { title: "Log in — Gatherly.pub" };

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { next } = await searchParams;
  return <LoginView next={safeNext(next)} />;
}
