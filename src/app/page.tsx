import { AtDinner } from "@/components/landing/AtDinner";
import { ExploreSeattle } from "@/components/landing/ExploreSeattle";
import { FinalCta } from "@/components/landing/FinalCta";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { PickVibe } from "@/components/landing/PickVibe";
import { Pricing } from "@/components/landing/Pricing";
import { Safety } from "@/components/landing/Safety";

export default function Home() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <ExploreSeattle />
      <PickVibe />
      <AtDinner />
      <Safety />
      <Pricing />
      <FinalCta />
    </>
  );
}
