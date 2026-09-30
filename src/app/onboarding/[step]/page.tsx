import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { OnboardingView } from "@/components/onboarding/OnboardingView";
import type { OnboardingStep } from "@/lib/booking";
import { safeNext } from "@/lib/next";

export const metadata: Metadata = { title: "Getting you ready — Gatherly.pub" };

const STEPS: OnboardingStep[] = ["verify", "profile", "intent", "questionnaire", "dietary"];

export default async function OnboardingPage({ params, searchParams }: PageProps<"/onboarding/[step]">) {
  const [{ step }, { next }] = await Promise.all([params, searchParams]);
  if (!STEPS.includes(step as OnboardingStep)) notFound();
  return <OnboardingView step={step as OnboardingStep} next={safeNext(next)} />;
}
