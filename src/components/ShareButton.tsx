"use client";

import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { RefObject, useState } from "react";
import { useSquadStore } from "@/store/useSquadStore";

interface ShareButtonProps {
    targetRef: RefObject<HTMLElement>;
}

export function ShareButton({ targetRef }: ShareButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const squadName = useSquadStore((state) => state.squadName);

    const handleDownload = async () => {
        const element = document.getElementById("squad-pitch");
        if (!element) {
            console.error("Pitch element not found");
            return;
        }

        setIsGenerating(true);
        try {
            // 1. Scroll to top to prevent offset issues
            window.scrollTo(0, 0);

            // 2. Wait for fonts
            await document.fonts.ready;
            await new Promise((resolve) => setTimeout(resolve, 500));

            // 3. Wait for all images to load (Robust iOS Fix)
            const waitForImages = () => {
                const images = Array.from(element.querySelectorAll('img'));
                return Promise.all(
                    images.map((img) => {
                        if (img.complete) return Promise.resolve();
                        return new Promise<void>((resolve) => {
                            img.onload = () => resolve();
                            img.onerror = () => resolve(); // Resolve even on error to avoid hanging
                        });
                    })
                );
            };

            await waitForImages();

            // 4. Generate canvas
            const canvas = await html2canvas(element, {
                backgroundColor: null,
                scale: window.devicePixelRatio || 2, // Retina quality
                logging: false,
                useCORS: true, // Critical for iOS
                allowTaint: false, // Critical for iOS
                imageTimeout: 0, // Wait indefinitely for images
                scrollX: 0,
                scrollY: 0,
                ignoreElements: (element) => {
                    return element.hasAttribute("data-html2canvas-ignore");
                },
            });
            // 5. Trigger Download
            const image = canvas.toDataURL("image/png");
            const link = document.createElement("a");
            link.href = image;

            // Generate filename
            const safeName = (squadName?.trim() || "adsiz-kadro")
                .toLowerCase()
                .replace(/[^a-z0-9çğıöşü]+/g, "-")
                .replace(/^-+|-+$/g, "");

            const turkishMap: Record<string, string> = {
                'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
                'Ç': 'c', 'Ğ': 'g', 'İ': 'i', 'Ö': 'o', 'Ş': 's', 'Ü': 'u'
            };
            const normalizedName = (squadName?.trim() || "adsiz-kadro")
                .split('')
                .map(char => turkishMap[char] || char)
                .join('')
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-+|-+$/g, "");

            const filename = normalizedName ? `fener_ajans_kadro_${normalizedName}.png` : "fener_ajans_kadro.png";
            link.download = filename;
            link.click();

        } catch (error) {
            console.error("Error generating squad image:", error);
            alert("Kadro görseli oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 bg-fb-yellow hover:bg-yellow-400 text-fb-navy font-bold py-3 px-4 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
            <Download size={18} />
            <span>{isGenerating ? "Hazırlanıyor..." : "Kadroyu İndir"}</span>
        </button>
    );
}
