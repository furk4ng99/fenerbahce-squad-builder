import type { Metadata } from "next";
import { PlannerStudio } from "@/components/PlannerStudio";

export const metadata: Metadata = {
    title: "Taktik Lab",
    description: "Etkileşimli kadro ve futbol taktik planlama stüdyosu.",
};

export default function PlannerLabPage() {
    return <PlannerStudio />;
}
