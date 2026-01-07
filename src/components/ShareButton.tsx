"use client";

import { Download, Copy } from "lucide-react";
import html2canvas from "html2canvas";
import { RefObject, useState } from "react";
import { useSquadStore } from "@/store/useSquadStore";
import { formations } from "@/data/formations";
import { Toast, useToast } from "./Toast";

interface ShareButtonProps {
    targetRef: RefObject<HTMLElement>;
}

export function ShareButton({ targetRef }: ShareButtonProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [isCopying, setIsCopying] = useState(false);
    const { toast, showToast, hideToast } = useToast();

    const squadName = useSquadStore((state) => state.squadName);
    const squad = useSquadStore((state) => state.squad);
    const bench = useSquadStore((state) => state.bench);
    const formation = useSquadStore((state) => state.formation);

    // Generate text summary of the squad
    const generateTextSummary = (): string => {
        const currentFormation = formations[formation];
        const lines: string[] = [];

        lines.push(`🦅 ${squadName || "Fenerbahçe Kadrosu"}`);
        lines.push(`📊 Diziliş: ${formation}`);
        lines.push("");
        lines.push("⚽ İLK 11:");

        // Group players by position type
        const gk = currentFormation.slots.filter(s => s.position === "GK");
        const def = currentFormation.slots.filter(s => ["LB", "CB", "RB", "LWB", "RWB"].includes(s.position));
        const mid = currentFormation.slots.filter(s => ["CDM", "CM", "CAM", "LM", "RM"].includes(s.position));
        const att = currentFormation.slots.filter(s => ["LW", "RW", "ST"].includes(s.position));

        const formatLine = (slots: typeof gk, label: string) => {
            const names = slots.map(s => squad[s.id]?.name || "—").join(", ");
            return `${label}: ${names}`;
        };

        lines.push(formatLine(gk, "KAL"));
        lines.push(formatLine(def, "DEF"));
        lines.push(formatLine(mid, "ORT"));
        lines.push(formatLine(att, "FOR"));

        // Add bench if any
        const benchPlayers = bench.filter(p => p !== null);
        if (benchPlayers.length > 0) {
            lines.push("");
            lines.push("🪑 YEDEKLER:");
            lines.push(benchPlayers.map(p => p?.name).join(", "));
        }

        lines.push("");
        lines.push("📱 fenerajans.com");

        return lines.join("\n");
    };

    // Copy to clipboard (image preferred, text fallback)
    const handleCopy = async () => {
        const element = document.getElementById("squad-export-area") || document.getElementById("squad-pitch");
        if (!element) {
            showToast("Element bulunamadı", "error");
            return;
        }

        setIsCopying(true);
        try {
            // Check if Clipboard API with images is supported
            const canCopyImage = typeof ClipboardItem !== "undefined" &&
                navigator.clipboard?.write;

            if (canCopyImage) {
                // Try image copy
                await document.fonts.ready;
                await new Promise((resolve) => setTimeout(resolve, 300));

                const canvas = await html2canvas(element, {
                    backgroundColor: null,
                    scale: 2,
                    logging: false,
                    useCORS: true,
                    allowTaint: false,
                });

                canvas.toBlob(async (blob) => {
                    if (blob) {
                        try {
                            const item = new ClipboardItem({ "image/png": blob });
                            await navigator.clipboard.write([item]);
                            showToast("Panoya kopyalandı! 📋", "success");
                        } catch (e) {
                            // Image copy failed, fallback to text
                            console.warn("Image copy failed, falling back to text:", e);
                            await navigator.clipboard.writeText(generateTextSummary());
                            showToast("Görsel kopyalanamadı, metin kopyalandı", "info");
                        }
                    } else {
                        // Blob creation failed, fallback to text
                        await navigator.clipboard.writeText(generateTextSummary());
                        showToast("Görsel oluşturulamadı, metin kopyalandı", "info");
                    }
                    setIsCopying(false);
                }, "image/png");
                return;
            } else {
                // No image clipboard support, use text
                await navigator.clipboard.writeText(generateTextSummary());
                showToast("Metin olarak kopyalandı", "info");
            }
        } catch (error) {
            console.error("Copy failed:", error);
            // Last resort: try text copy
            try {
                await navigator.clipboard.writeText(generateTextSummary());
                showToast("Metin olarak kopyalandı", "info");
            } catch {
                showToast("Kopyalama başarısız", "error");
            }
        } finally {
            setIsCopying(false);
        }
    };

    const handleDownload = async () => {
        const element = document.getElementById("squad-export-area") || document.getElementById("squad-pitch");
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
        <>
            <div className="flex gap-2">
                <button
                    onClick={handleCopy}
                    disabled={isCopying}
                    className="flex items-center justify-center gap-2 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
                    title="Panoya Kopyala"
                >
                    <Copy size={18} />
                    <span className="hidden sm:inline">{isCopying ? "..." : "Kopyala"}</span>
                </button>
                <button
                    onClick={handleDownload}
                    disabled={isGenerating}
                    className="flex items-center justify-center gap-2 bg-fb-yellow hover:bg-yellow-400 text-fb-navy font-bold py-3 px-4 rounded-lg transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex-1"
                >
                    <Download size={18} />
                    <span>{isGenerating ? "Hazırlanıyor..." : "Kadroyu İndir"}</span>
                </button>
            </div>
            <Toast
                message={toast.message}
                type={toast.type}
                isVisible={toast.isVisible}
                onClose={hideToast}
            />
        </>
    );
}
