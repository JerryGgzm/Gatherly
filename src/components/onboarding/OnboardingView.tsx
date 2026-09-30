"use client";

import type { OnboardingStep } from "@/lib/booking";
import { useDemo } from "@/lib/store";
import { DietaryStep } from "./DietaryStep";
import { IntentStep } from "./IntentStep";
import { ProfileStep } from "./ProfileStep";
import { QuestionnaireStep } from "./QuestionnaireStep";
import { VerifyStep } from "./VerifyStep";

const VIEWS: Record<OnboardingStep, (p: { next: string }) => React.ReactNode> = {
  verify: VerifyStep,
  profile: ProfileStep,
  intent: IntentStep,
  questionnaire: QuestionnaireStep,
  dietary: DietaryStep,
};

export function OnboardingView({ step, next }: { step: OnboardingStep; next: string }) {
  const { hydrated } = useDemo();
  // Steps seed their local form state from saved progress, so wait until it's loaded.
  if (!hydrated) return <div className="dotted-bg flex-1" />;
  const View = VIEWS[step];
  return <View key={step} next={next} />;
}
