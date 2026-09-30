import type { Metadata } from "next";
import { SignupView } from "@/components/flow/AuthViews";
import { safeNext } from "@/lib/next";

export const metadata: Metadata = { title: "Sign up — Gatherly.pub" };

export default async function SignupPage({ searchParams }: PageProps<"/signup">) {
  const { next } = await searchParams;
  return <SignupView next={safeNext(next)} />;
}
