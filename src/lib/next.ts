/** Only same-site paths are allowed as `?next=` targets. */
export const safeNext = (raw: string | string[] | null | undefined) => {
  const v = Array.isArray(raw) ? raw[0] : raw;
  return v && v.startsWith("/") && !v.startsWith("//") ? v : "/explore";
};
