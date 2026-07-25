"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
    ArrowUpRight,
    Home,
    Menu,
    Search,
    Shield,
    Sparkles,
    X,
} from "lucide-react";
import styles from "./SiteChrome.module.css";

const NAV_ITEMS = [
    { href: "/", label: "Ana sayfa", icon: Home, hint: "Fener Ajans başlangıç ekranı" },
    { href: "/kadro-lab", label: "Taktik Lab", icon: Shield, hint: "Kadro ve oyun planı oluştur" },
];

export default function SiteChrome({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [commandOpen, setCommandOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const isTyping =
                target?.tagName === "INPUT" ||
                target?.tagName === "TEXTAREA" ||
                target?.isContentEditable;

            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setCommandOpen((value) => !value);
            }

            if (!isTyping && event.key === "/") {
                event.preventDefault();
                setCommandOpen(true);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, []);

    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    const navigate = (href: string) => {
        setCommandOpen(false);
        router.push(href);
    };

    return (
        <div className={styles.appShell}>
            <header className={styles.siteHeader}>
                <div className={styles.headerInner}>
                    <Link href="/" className={styles.brand} aria-label="Fener Ajans ana sayfa">
                        <span className={styles.brandLogoFrame}>
                            <img
                                className={styles.brandLogo}
                                src="/fener-ajans-watermark.png"
                                alt="Fener Ajans"
                            />
                        </span>
                    </Link>

                    <nav className={styles.desktopNav} aria-label="Ana navigasyon">
                        {NAV_ITEMS.slice(1).map((item) => {
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={active ? styles.navLinkActive : styles.navLink}
                                    aria-current={active ? "page" : undefined}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className={styles.headerActions}>
                        <button
                            type="button"
                            className={styles.commandButton}
                            onClick={() => setCommandOpen(true)}
                            aria-label="Hızlı menüyü aç"
                        >
                            <Search size={16} />
                            <span>Hızlı menü</span>
                            <kbd>⌘K</kbd>
                        </button>
                        <Link href="/kadro-lab" className={styles.primaryNavAction}>
                            Kadro kur
                            <ArrowUpRight size={16} />
                        </Link>
                        <button
                            type="button"
                            className={styles.mobileToggle}
                            onClick={() => setMobileOpen((value) => !value)}
                            aria-expanded={mobileOpen}
                            aria-label={mobileOpen ? "Menüyü kapat" : "Menüyü aç"}
                        >
                            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
                        </button>
                    </div>
                </div>

                {mobileOpen && (
                    <nav className={styles.mobileNav} aria-label="Mobil navigasyon">
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const active = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={active ? styles.mobileLinkActive : styles.mobileLink}
                                >
                                    <Icon size={18} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                )}
            </header>

            <main className={styles.main}>{children}</main>

            <footer className={styles.footer}>
                <div className={styles.footerInner}>
                    <div>
                        <strong>Fener Ajans</strong>
                        <span>Futbol fikirlerini sahaya taşı.</span>
                    </div>
                    <p>Topluluk odaklı bağımsız taraftar projesi.</p>
                    <Link href="/kadro-lab">
                        Taktik Lab&apos;i aç
                        <ArrowUpRight size={15} />
                    </Link>
                </div>
            </footer>

            <Command.Dialog
                open={commandOpen}
                onOpenChange={setCommandOpen}
                label="Fener Ajans hızlı menü"
                className={styles.commandDialog}
            >
                <div className={styles.commandOverlay} onClick={() => setCommandOpen(false)} />
                <div className={styles.commandPanel}>
                    <div className={styles.commandTop}>
                        <Search size={19} />
                        <Command.Input placeholder="Sayfa veya özellik ara..." autoFocus />
                        <kbd>ESC</kbd>
                    </div>
                    <Command.List className={styles.commandList}>
                        <Command.Empty className={styles.commandEmpty}>
                            Bu aramayla eşleşen bir özellik yok.
                        </Command.Empty>
                        <Command.Group heading="Hızlı geçiş">
                            {NAV_ITEMS.map((item) => {
                                const Icon = item.icon;
                                return (
                                    <Command.Item
                                        key={item.href}
                                        value={`${item.label} ${item.hint}`}
                                        onSelect={() => navigate(item.href)}
                                        className={styles.commandItem}
                                    >
                                        <span className={styles.commandIcon}>
                                            <Icon size={18} />
                                        </span>
                                        <span>
                                            <strong>{item.label}</strong>
                                            <small>{item.hint}</small>
                                        </span>
                                        <ArrowUpRight size={16} />
                                    </Command.Item>
                                );
                            })}
                        </Command.Group>
                        <Command.Group heading="Önerilen">
                            <Command.Item
                                value="Yeni taktik planı oluştur"
                                onSelect={() => navigate("/kadro-lab")}
                                className={styles.commandItem}
                            >
                                <span className={`${styles.commandIcon} ${styles.commandIconAccent}`}>
                                    <Sparkles size={18} />
                                </span>
                                <span>
                                    <strong>Yeni plan başlat</strong>
                                    <small>4-2-3-1 ile temiz bir çalışma alanı aç</small>
                                </span>
                                <ArrowUpRight size={16} />
                            </Command.Item>
                        </Command.Group>
                    </Command.List>
                    <div className={styles.commandFooter}>
                        <span><kbd>↑↓</kbd> gezin</span>
                        <span><kbd>↵</kbd> aç</span>
                        <span><kbd>/</kbd> hızlı erişim</span>
                    </div>
                </div>
            </Command.Dialog>
        </div>
    );
}
