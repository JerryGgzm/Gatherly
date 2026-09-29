export type HeroEvent =
  | "hero_cat_hover"
  | "hero_cat_click"
  | "hero_cat_rare_reaction"
  | "hero_cross_cat_reaction"
  | "hero_empty_seat_hover"
  | "hero_empty_seat_click"
  | "hero_take_seat_click"
  | "hero_conversion_started";

type Props = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

export function deviceType(): "mobile" | "desktop" {
  if (typeof window === "undefined") return "desktop";
  return window.matchMedia("(hover: none)").matches ? "mobile" : "desktop";
}

export function track(event: HeroEvent, props: Props = {}) {
  if (typeof window === "undefined") return;
  const payload = { event, device_type: deviceType(), ...props };
  (window.dataLayer ??= []).push(payload);
  if (process.env.NODE_ENV === "development") console.debug("[analytics]", payload);
}
