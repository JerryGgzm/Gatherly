import type { Metadata } from "next";
import { BookView } from "@/components/booking/BookView";

export const metadata: Metadata = { title: "Save your seat — Gatherly.pub" };

export default async function BookPage({ params }: PageProps<"/book/[id]">) {
  const { id } = await params;
  return <BookView id={id} />;
}
