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

const canvasToPngBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob) {
                resolve(blob);
                return;
            }

            reject(new Error("PNG blob could not be created"));
        }, "image/png");
    });
};

const downloadBlob = (blob: Blob, filename: string) => {
    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = objectUrl;
    link.download = filename;
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};

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

    // Copy to clipboard (iOS/Safari Optimized with Promise pattern)
    const handleCopy = async () => {
        const element = document.getElementById("squad-export-area") || document.getElementById("squad-pitch");
        if (!element) {
            showToast("Element bulunamadı", "error");
            return;
        }

        setIsCopying(true);
        const textSummary = generateTextSummary();

        try {
            // Check for ClipboardItem support
            if (typeof ClipboardItem !== "undefined" && navigator.clipboard?.write) {
                // Create a Promise that resolves to the Blob
                // This allows us to call write() immediately (satisfying Safari's gesture requirement)
                // while generating the image in the background.
                const blobPromise = new Promise<Blob | null>(async (resolve, reject) => {
                    try {
                        await document.fonts.ready;
                        await new Promise((r) => setTimeout(r, 150)); // Short stabilization wait

                        const canvas = await html2canvas(element, {
                            backgroundColor: null,
                            scale: 2,
                            logging: false,
                            useCORS: true,
                            allowTaint: false,
                        });

                        canvas.toBlob((blob) => {
                            if (blob) resolve(blob);
                            else reject(new Error("Blob failed"));
                        }, "image/png");
                    } catch (error) {
                        reject(error);
                    }
                });

                // Safari requires the Promise to be passed directly to ClipboardItem
                // We cast to any because TS definition might not explicitly support Promise<Blob> yet
                const item = new ClipboardItem({
                    "image/png": blobPromise as unknown as Blob
                });

                await navigator.clipboard.write([item]);
                showToast("Panoya kopyalandı! 📋", "success");
            } else {
                throw new Error("Clipboard API not supported");
            }
        } catch (error) {
            console.error("Image copy failed:", error);
            // Fallback to text copy
            // Note: If the image generation took too long and failed, this might also fail on iOS
            // due to lost gesture. But it's our best fallback.
            try {
                await navigator.clipboard.writeText(textSummary);
                showToast("Görsel oluşturulamadı, metin kopyalandı", "info");
            } catch (textError) {
                console.error("Fallback text copy failed:", textError);
                showToast("Kopyalama başarısız (İzinleri kontrol edin)", "error");
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
                scale: Math.min(window.devicePixelRatio || 2, 2), // Limit mobile memory usage
                logging: false,
                useCORS: true, // Critical for iOS
                allowTaint: false, // Critical for iOS
                imageTimeout: 15000,
                scrollX: 0,
                scrollY: 0,
                ignoreElements: (element) => {
                    return element.hasAttribute("data-html2canvas-ignore");
                },
            });

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
            const blob = await canvasToPngBlob(canvas);
            const file = new File([blob], filename, { type: "image/png" });
            const canShareFile = typeof navigator.share === "function"
                && typeof navigator.canShare === "function"
                && navigator.canShare({ files: [file] });

            // Native share is the most reliable way to save an asynchronously
            // generated image on iOS and other mobile browsers.
            if (canShareFile) {
                try {
                    await navigator.share({
                        files: [file],
                        title: squadName?.trim() || "Fenerbahçe Kadrosu",
                    });
                    showToast("Kadro görseli paylaşıma hazır", "success");
                    return;
                } catch (shareError) {
                    if (shareError instanceof DOMException && shareError.name === "AbortError") {
                        return;
                    }

                    console.warn("Native share failed, falling back to download:", shareError);
                }
            }

            // Blob URLs avoid the large data URL and detached-link behavior
            // that mobile browsers can silently reject.
            downloadBlob(blob, filename);
            showToast("Kadro görseli indirildi", "success");

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
