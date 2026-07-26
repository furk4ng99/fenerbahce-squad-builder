"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
    ArrowRight,
    ArrowUpRight,
    BarChart3,
    Command,
    Database,
    Gauge,
    Layers3,
    Move,
    ShieldCheck,
    Sparkles,
    Users,
    Zap,
} from "lucide-react";
import styles from "./HomeExperience.module.css";

type PhaseKey = "Kurulum" | "Geçiş" | "Baskı";

const PHASES: Record<
    PhaseKey,
    {
        note: string;
        metric: string;
        value: number;
        points: Array<[number, number, string]>;
    }
> = {
    Kurulum: {
        note: "3+2 çıkış yapısı, merkezde iki temiz pas açısı.",
        metric: "Pas güvenliği",
        value: 82,
        points: [
            [50, 88, "KA"], [16, 72, "DK"], [38, 73, "EY"], [62, 73, "BS"], [84, 72, "BA"],
            [38, 54, "MT"], [62, 54, "CÖ"], [16, 33, "AK"], [50, 38, "EE"], [84, 33, "BY"], [50, 15, "ED"],
        ],
    },
    Geçiş: {
        note: "Top kazanıldığında üç dikey koşu ve geniş çıkış.",
        metric: "İlerleme hızı",
        value: 91,
        points: [
            [50, 89, "KA"], [20, 74, "DK"], [40, 74, "EY"], [60, 74, "BS"], [80, 74, "BA"],
            [42, 58, "MT"], [58, 55, "CÖ"], [10, 25, "AK"], [48, 31, "EE"], [90, 25, "BY"], [55, 12, "ED"],
        ],
    },
    Baskı: {
        note: "Ön alanı beş oyuncuyla kilitleyen kompakt pres.",
        metric: "Baskı yoğunluğu",
        value: 87,
        points: [
            [50, 84, "KA"], [24, 66, "DK"], [41, 68, "EY"], [59, 68, "BS"], [76, 66, "BA"],
            [42, 49, "MT"], [58, 49, "CÖ"], [22, 30, "AK"], [50, 34, "EE"], [78, 30, "BY"], [50, 18, "ED"],
        ],
    },
};

const PRODUCT_CARDS = [
    {
        number: "01",
        icon: Database,
        title: "Global veritabanı",
        description: "47 binden fazla oyuncuyu isme, kulübe veya pozisyona göre bul ve kadrona ekle.",
        href: "/kadro-lab",
        accent: "yellow",
        meta: "47.853 oyuncu",
    },
    {
        number: "02",
        icon: Move,
        title: "Canlı saha düzeni",
        description: "Oyuncuları sürükle, dizilişi değiştir ve her saha konumunu tek tek yönet.",
        href: "/kadro-lab",
        accent: "cyan",
        meta: "Sürükle & bırak",
    },
    {
        number: "03",
        icon: BarChart3,
        title: "Taktik analiz",
        description: "Tempo, genişlik ve savunma çizgisi değiştikçe takım profilini anında gör.",
        href: "/kadro-lab",
        accent: "blue",
        meta: "Anlık geri bildirim",
    },
];

export function HomeExperience({
    playerCount,
    formationCount,
}: {
    playerCount: number;
    formationCount: number;
}) {
    const [phase, setPhase] = useState<PhaseKey>("Kurulum");
    const activePhase = PHASES[phase];

    return (
        <div className={styles.home}>
            <div className={styles.gridBackdrop} />
            <div className={styles.glowTop} />

            <section className={styles.hero}>
                <div className={styles.heroCopy}>
                    <motion.div
                        className={styles.eyebrow}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span />
                        Yeni nesil taraftar stüdyosu
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 22 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                    >
                        KADRO DEĞİL,
                        <em>OYUN FİKRİ KUR.</em>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16 }}
                    >
                        Dizilişten daha fazlası: oyuncu rolleri, oyun fazları, takım
                        davranışları ve anlık taktik analizi tek çalışma alanında.
                    </motion.p>
                    <motion.div
                        className={styles.heroActions}
                        initial={{ opacity: 0, y: 18 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.22 }}
                    >
                        <Link href="/kadro-lab" className={styles.primaryCta}>
                            Taktik planını aç
                            <ArrowRight size={18} />
                        </Link>
                        <button
                            type="button"
                            className={styles.secondaryCta}
                            onClick={() =>
                                window.dispatchEvent(
                                    new KeyboardEvent("keydown", { key: "k", metaKey: true })
                                )
                            }
                        >
                            <Command size={17} />
                            Hızlı menü
                            <kbd>⌘K</kbd>
                        </button>
                    </motion.div>
                    <motion.div
                        className={styles.trustRow}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.32 }}
                    >
                        <span><Move size={15} /> Sürükle & bırak</span>
                        <span><BarChart3 size={15} /> Canlı analiz</span>
                        <span><Sparkles size={15} /> Cihazda kayıt</span>
                    </motion.div>
                </div>

                <motion.div
                    className={styles.liveBoard}
                    initial={{ opacity: 0, scale: 0.96, y: 24 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.18, duration: 0.55 }}
                >
                    <div className={styles.boardTop}>
                        <div>
                            <span>CANLI OYUN PLANI</span>
                            <strong>4-2-3-1 · Kontrol</strong>
                        </div>
                        <div className={styles.liveBadge}><i /> Aktif</div>
                    </div>

                    <div className={styles.phaseSwitch} aria-label="Oyun fazı ön izlemesi">
                        {(Object.keys(PHASES) as PhaseKey[]).map((item) => (
                            <button
                                type="button"
                                key={item}
                                onClick={() => setPhase(item)}
                                className={phase === item ? styles.phaseActive : styles.phase}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <div className={styles.miniPitch}>
                        <div className={styles.pitchLines}>
                            <span className={styles.pitchHalf} />
                            <span className={styles.pitchCircle} />
                            <span className={styles.pitchTopBox} />
                            <span className={styles.pitchBottomBox} />
                        </div>
                        {activePhase.points.map(([x, y, label], index) => (
                            <motion.span
                                className={index === 10 ? styles.focusPlayer : styles.miniPlayer}
                                key={`${index}-${label}`}
                                animate={{ left: `${x}%`, top: `${y}%` }}
                                transition={{ type: "spring", stiffness: 180, damping: 22 }}
                            >
                                {label}
                            </motion.span>
                        ))}
                    </div>

                    <div className={styles.boardInsight}>
                        <span className={styles.insightIcon}><Zap size={17} /></span>
                        <div>
                            <small>{activePhase.metric}</small>
                            <strong>{activePhase.note}</strong>
                        </div>
                        <b>{activePhase.value}</b>
                    </div>
                </motion.div>
            </section>

            <section className={styles.statBand} aria-label="Platform istatistikleri">
                <div>
                    <strong>{playerCount.toLocaleString("tr-TR")}+</strong>
                    <span>Global oyuncu</span>
                </div>
                <div>
                    <strong>{formationCount}</strong>
                    <span>Hazır diziliş</span>
                </div>
                <div>
                    <strong>3</strong>
                    <span>Canlı oyun fazı</span>
                </div>
                <div>
                    <strong>∞</strong>
                    <span>Taktik olasılığı</span>
                </div>
            </section>

            <section className={styles.productSection}>
                <div className={styles.sectionIntro}>
                    <div>
                        <span>TEK ÇALIŞMA ALANI, TAM KONTROL</span>
                        <h2>Kadronu veriden sahaya taşı.</h2>
                    </div>
                    <p>
                        Oyuncu bulma, kadro kurma ve taktik analizi artık aynı hızlı,
                        sade ve mobil uyumlu çalışma alanında.
                    </p>
                </div>

                <div className={styles.productGrid}>
                    {PRODUCT_CARDS.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Link
                                href={card.href}
                                key={card.number}
                                className={`${styles.productCard} ${styles[card.accent]}`}
                            >
                                <div className={styles.cardTop}>
                                    <span>{card.number}</span>
                                    <ArrowUpRight size={19} />
                                </div>
                                <span className={styles.cardIcon}><Icon size={25} /></span>
                                <small>{card.meta}</small>
                                <h3>{card.title}</h3>
                                <p>{card.description}</p>
                            </Link>
                        );
                    })}
                </div>
            </section>

            <section className={styles.systemSection}>
                <div className={styles.systemCard}>
                    <div className={styles.systemVisual}>
                        <span className={styles.orbitOne}><Gauge size={18} /></span>
                        <span className={styles.orbitTwo}><Layers3 size={18} /></span>
                        <span className={styles.orbitThree}><Users size={18} /></span>
                        <div>
                            <ShieldCheck size={30} />
                            <strong>FA</strong>
                        </div>
                    </div>
                    <div className={styles.systemCopy}>
                        <span>PLANLAMA SİSTEMİ</span>
                        <h2>Her tıklama sahada karşılık bulur.</h2>
                        <p>
                            Diziliş oyuncuları yeniden konumlandırır, oyun modeli takım
                            değerlerini değiştirir, faz seçimi sahadaki davranışı anında
                            gösterir.
                        </p>
                        <Link href="/kadro-lab">
                            Çalışma alanını keşfet
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                    <div className={styles.systemFacts}>
                        <article><strong>01</strong><span>Rol bazlı oyuncu yönetimi</span></article>
                        <article><strong>02</strong><span>Canlı performans grafiği</span></article>
                        <article><strong>03</strong><span>Yerel plan kaydı</span></article>
                    </div>
                </div>
            </section>
        </div>
    );
}
