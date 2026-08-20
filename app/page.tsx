import type { Metadata } from "next";
import { HomePage } from "./ui/HomePage";

export const metadata: Metadata = {
  title: "JdemNaTo! – práce, zakázky a dodavatelé",
  description: "Najděte práci, brigádu nebo zakázku podle oboru, lokality a způsobu práce. Přehledně, bez CV a přímo u zadavatele.",
  alternates: { canonical: "/" },
};

export default function Page() { return <HomePage />; }
