"use client";

import { MotionConfig } from "framer-motion";
import { DemoProvider } from "@/lib/store";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <DemoProvider>{children}</DemoProvider>
    </MotionConfig>
  );
}
