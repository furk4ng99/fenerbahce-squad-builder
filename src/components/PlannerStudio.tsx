"use client";

import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
    DndContext,
    PointerSensor,
    type DragEndEvent,
    useDraggable,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import * as Slider from "@radix-ui/react-slider";
import * as Tooltip from "@radix-ui/react-tooltip";
import {
    ArrowUpRight,
    Check,
    CircleDot,
    Copy,
    Database,
    Download,
    FileText,
    Gauge,
    Move,
    RefreshCw,
    RotateCcw,
    ShieldCheck,
    Shirt,
    Sparkles,
    Target,
    Trash2,
    UserPlus,
    Zap,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import {
    PolarAngleAxis,
    PolarGrid,
    Radar,
    RadarChart,
    ResponsiveContainer,
} from "recharts";
import { formations } from "@/data/formations";
import type { Player } from "@/types";
import fenerbahcePlayers from "../../public/data/fenerbahce-players.json";
import { PlannerPlayerDatabase } from "./PlannerPlayerDatabase";
import styles from "./PlannerStudio.module.css";

type PlannerPlayer = {
    id: string;
    name: string;
    number: number;
    position: string;
    role: string;
    x: number;
    y: number;
    empty?: boolean;
    databaseId?: string | number;
    club?: string;
    rating?: number;
    sourcePosition?: string;
    image?: string;
    imageSprite?: {
        column: number;
        row: number;
        columns: number;
        rows: number;
    };
};

type SavedPlan = {
    formation: string;
    model: string;
    phase: string;
    tempo: number;
    width: number;
    line: number;
    players: PlannerPlayer[];
};

const STORAGE_KEY = "fener-planner-lab";
const DEFAULT_FORMATION = "4-2-3-1";
const PLAYER_COUNT = 47853;
const LOCAL_FENER_PLAYERS = fenerbahcePlayers.players as Player[];

const ROLE_OPTIONS = [
    "Dengeli",
    "Oyun kurucu",
    "Çizgiye bas",
    "İçe kat et",
    "Pres lideri",
    "Süpürücü",
    "Geriden kur",
];

const MODELS = [
    { id: "kontrol", label: "Kontrol", detail: "Sabırlı pas" },
    { id: "dikey", label: "Dikey", detail: "Hızlı ilerle" },
    { id: "pres", label: "Yoğun pres", detail: "Topu erken kazan" },
];

const PHASES = ["Topa sahip", "Geçiş", "Savunma"];

const MODEL_PRESETS: Record<string, { tempo: number; width: number; line: number }> = {
    kontrol: { tempo: 62, width: 58, line: 66 },
    dikey: { tempo: 84, width: 64, line: 72 },
    pres: { tempo: 76, width: 46, line: 86 },
};

const PHASE_COPY: Record<string, { title: string; detail: string }> = {
    "Topa sahip": {
        title: "Yerleşik hücum",
        detail: "Bekler genişliyor, merkez üçgeni pas istasyonlarını koruyor.",
    },
    Geçiş: {
        title: "Dikey çıkış",
        detail: "Ön hat koşuya başlıyor, merkez topun arkasında güvenlik sağlıyor.",
    },
    Savunma: {
        title: "Kompakt blok",
        detail: "Hatlar merkeze daralıyor ve takım boyu kısalıyor.",
    },
};

const POSITION_ALTERNATIVES: Record<string, string[]> = {
    GK: ["GK"],
    LB: ["LB", "LWB"],
    LWB: ["LB", "LWB"],
    RB: ["RB", "RWB"],
    RWB: ["RB", "RWB"],
    CB: ["CB"],
    CDM: ["CDM", "CM"],
    CM: ["CM", "CDM", "CAM"],
    CAM: ["CAM", "CM"],
    LM: ["LW", "LM", "CM"],
    RM: ["RW", "RM", "CM"],
    LW: ["LW", "LM", "RW"],
    RW: ["RW", "RM", "LW"],
    ST: ["ST", "CAM"],
};

function createPlayers(formationName: string): PlannerPlayer[] {
    const config = formations[formationName] ?? formations[DEFAULT_FORMATION];
    const usedPlayers = new Set<string>();

    return config.slots.map((slot, index) => {
        const alternatives = POSITION_ALTERNATIVES[slot.position] ?? [slot.position];
        const databasePlayer = LOCAL_FENER_PLAYERS.find(
            (player) =>
                alternatives.includes(player.position) &&
                !usedPlayers.has(String(player.id))
        );

        if (databasePlayer) usedPlayers.add(String(databasePlayer.id));

        return {
            id: slot.id,
            name: databasePlayer?.name ?? "Oyuncu ekle",
            number: index === 0 ? 1 : index + 2,
            position: slot.position,
            role: index === 0 ? "Geriden kur" : "Dengeli",
            x: slot.x,
            y: slot.y,
            empty: !databasePlayer,
            databaseId: databasePlayer?.id,
            club: databasePlayer?.club,
            rating: databasePlayer?.rating,
            sourcePosition: databasePlayer?.position,
            image: databasePlayer?.image,
            imageSprite: databasePlayer?.imageSprite,
        };
    });
}

function clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
}

function DraggablePlayer({
    player,
    selected,
    onSelect,
}: {
    player: PlannerPlayer;
    selected: boolean;
    onSelect: () => void;
}) {
    const { attributes, listeners, setNodeRef, transform, isDragging } =
        useDraggable({ id: player.id });

    const style = {
        left: `${player.x}%`,
        top: `${player.y}%`,
        transform: transform
            ? `translate3d(${transform.x}px, ${transform.y}px, 0) translate(-50%, -50%)`
            : "translate(-50%, -50%)",
        zIndex: isDragging ? 40 : selected ? 30 : 20,
    };

    return (
        <button
            ref={setNodeRef}
            type="button"
            style={style}
            className={`${styles.playerNode} ${selected ? styles.playerNodeSelected : ""} ${isDragging ? styles.playerNodeDragging : ""} ${player.empty ? styles.playerNodeEmpty : ""}`}
            onClick={onSelect}
            aria-label={
                player.empty
                    ? `${player.position} pozisyonuna oyuncu ekle`
                    : `${player.name}, ${player.position}. Taşımak için sürükleyin.`
            }
            {...listeners}
            {...attributes}
        >
            <span className={styles.playerMarker}>
                {player.empty ? (
                    <UserPlus size={18} />
                ) : (
                    <span className={styles.playerJersey}>
                        <Shirt size={35} strokeWidth={1.8} aria-hidden="true" />
                    </span>
                )}
            </span>
            <span className={styles.playerName}>
                {player.empty ? "Oyuncu ekle" : player.name}
            </span>
            <span className={styles.playerPosition}>{player.position}</span>
        </button>
    );
}

function SliderControl({
    label,
    value,
    low,
    high,
    onChange,
}: {
    label: string;
    value: number;
    low: string;
    high: string;
    onChange: (value: number) => void;
}) {
    return (
        <div className={styles.sliderGroup}>
            <div className={styles.sliderHeader}>
                <span>{label}</span>
                <strong>{value}</strong>
            </div>
            <Slider.Root
                className={styles.sliderRoot}
                value={[value]}
                min={0}
                max={100}
                step={1}
                onValueChange={([next]) => onChange(next)}
                aria-label={label}
            >
                <Slider.Track className={styles.sliderTrack}>
                    <Slider.Range className={styles.sliderRange} />
                </Slider.Track>
                <Slider.Thumb className={styles.sliderThumb} />
            </Slider.Root>
            <div className={styles.sliderLegend}>
                <span>{low}</span>
                <span>{high}</span>
            </div>
        </div>
    );
}

function IconAction({
    label,
    onClick,
    children,
    primary = false,
}: {
    label: string;
    onClick: () => void;
    children: ReactNode;
    primary?: boolean;
}) {
    return (
        <Tooltip.Root>
            <Tooltip.Trigger asChild>
                <button
                    type="button"
                    className={primary ? styles.primaryIconButton : styles.iconButton}
                    onClick={onClick}
                    aria-label={label}
                >
                    {children}
                </button>
            </Tooltip.Trigger>
            <Tooltip.Portal>
                <Tooltip.Content className={styles.tooltip} sideOffset={8}>
                    {label}
                    <Tooltip.Arrow className={styles.tooltipArrow} />
                </Tooltip.Content>
            </Tooltip.Portal>
        </Tooltip.Root>
    );
}

export function PlannerStudio() {
    const [formation, setFormation] = useState(DEFAULT_FORMATION);
    const [model, setModel] = useState("kontrol");
    const [phase, setPhase] = useState(PHASES[0]);
    const [tempo, setTempo] = useState(66);
    const [width, setWidth] = useState(58);
    const [line, setLine] = useState(72);
    const [players, setPlayers] = useState<PlannerPlayer[]>(() =>
        createPlayers(DEFAULT_FORMATION)
    );
    const [selectedId, setSelectedId] = useState("cam");
    const [dirty, setDirty] = useState(false);
    const [reportOpen, setReportOpen] = useState(false);
    const [databaseOpen, setDatabaseOpen] = useState(false);
    const pitchRef = useRef<HTMLDivElement>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: { distance: 6 },
        })
    );

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const saved = JSON.parse(raw) as SavedPlan;
            if (!formations[saved.formation] || !Array.isArray(saved.players)) return;
            const isLegacyPlan = !saved.players.some(
                (player) => player.databaseId || player.empty
            );
            const restoredPlayers = isLegacyPlan
                ? createPlayers(saved.formation).map((player, index) => ({
                    ...player,
                    x: saved.players[index]?.x ?? player.x,
                    y: saved.players[index]?.y ?? player.y,
                    role: saved.players[index]?.role ?? player.role,
                }))
                : saved.players;

            setFormation(saved.formation);
            setModel(saved.model);
            setPhase(saved.phase);
            setTempo(saved.tempo);
            setWidth(saved.width);
            setLine(saved.line);
            setPlayers(restoredPlayers);
            setSelectedId(restoredPlayers[0]?.id ?? "");
            setDirty(false);
        } catch {
            window.localStorage.removeItem(STORAGE_KEY);
        }
    }, []);

    const selectedPlayer =
        players.find((player) => player.id === selectedId) ?? players[0];

    const metrics = useMemo(
        () => ({
            control: Math.round(tempo * 0.38 + width * 0.34 + line * 0.28),
            transition: Math.round(tempo * 0.62 + line * 0.38),
            compactness: Math.round(line * 0.54 + (100 - width) * 0.46),
        }),
        [line, tempo, width]
    );

    const radarData = useMemo(
        () => [
            { metric: "Kontrol", value: metrics.control },
            { metric: "Geçiş", value: metrics.transition },
            { metric: "Kompakt", value: metrics.compactness },
            { metric: "Tempo", value: tempo },
            { metric: "Genişlik", value: width },
        ],
        [metrics, tempo, width]
    );

    const displayPlayers = useMemo(() => {
        if (phase === "Topa sahip") return players;

        return players.map((player) => {
            if (player.position === "GK") return player;

            if (phase === "Geçiş") {
                const isAttacker = ["ST", "LW", "RW", "CAM", "LM", "RM"].includes(player.position);
                return {
                    ...player,
                    x: clamp(player.x + (player.x < 50 ? -2 : player.x > 50 ? 2 : 0), 6, 94),
                    y: clamp(player.y - (isAttacker ? 7 : 3), 6, 94),
                };
            }

            const isAttacker = ["ST", "LW", "RW", "CAM", "LM", "RM"].includes(player.position);
            return {
                ...player,
                x: clamp(50 + (player.x - 50) * 0.82, 8, 92),
                y: clamp(player.y + (isAttacker ? 10 : 5), 7, 93),
            };
        });
    }, [phase, players]);

    const handleFormation = (nextFormation: string) => {
        const selectedIndex = players.findIndex((player) => player.id === selectedId);
        const config = formations[nextFormation] ?? formations[DEFAULT_FORMATION];
        const nextPlayers = config.slots.map((slot, index) => {
            const existing = players[index] ?? createPlayers(nextFormation)[index];
            return {
                ...existing,
                id: slot.id,
                position: slot.position,
                x: slot.x,
                y: slot.y,
            };
        });
        setFormation(nextFormation);
        setPlayers(nextPlayers);
        setSelectedId(
            nextPlayers[selectedIndex >= 0 ? selectedIndex : 0]?.id ?? nextPlayers[0].id
        );
        setDirty(true);
        toast.success(`${nextFormation} dizilişine geçildi`, {
            description: "Kadro korunarak oyuncular yeni konumlarına yerleşti.",
        });
    };

    const handleModel = (nextModel: string) => {
        const preset = MODEL_PRESETS[nextModel];
        setModel(nextModel);
        setTempo(preset.tempo);
        setWidth(preset.width);
        setLine(preset.line);
        setDirty(true);
        toast(`${MODELS.find((item) => item.id === nextModel)?.label} modeli uygulandı`, {
            description: "Tempo, genişlik ve savunma çizgisi birlikte güncellendi.",
        });
    };

    const handlePhase = (nextPhase: string) => {
        setPhase(nextPhase);
        setDirty(true);
        toast(`${nextPhase} görünümü açıldı`, {
            description: PHASE_COPY[nextPhase].detail,
        });
    };

    const handleDragEnd = ({ active, delta }: DragEndEvent) => {
        if (!pitchRef.current) return;
        const bounds = pitchRef.current.getBoundingClientRect();

        setPlayers((current) =>
            current.map((player) => {
                if (player.id !== active.id) return player;
                return {
                    ...player,
                    x: clamp(player.x + (delta.x / bounds.width) * 100, 7, 93),
                    y: clamp(player.y + (delta.y / bounds.height) * 100, 7, 93),
                };
            })
        );
        setDirty(true);
    };

    const persistPlan = () => {
        const payload: SavedPlan = {
            formation,
            model,
            phase,
            tempo,
            width,
            line,
            players,
        };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        setDirty(false);
    };

    const resetPlan = () => {
        window.localStorage.removeItem(STORAGE_KEY);
        setFormation(DEFAULT_FORMATION);
        setModel("kontrol");
        setPhase(PHASES[0]);
        setTempo(66);
        setWidth(58);
        setLine(72);
        setPlayers(createPlayers(DEFAULT_FORMATION));
        setSelectedId("cam");
        setDirty(false);
        setReportOpen(false);
        setDatabaseOpen(false);
        toast("Plan başlangıç ayarlarına döndü");
    };

    const updateSelectedRole = (role: string) => {
        setPlayers((current) =>
            current.map((player) =>
                player.id === selectedPlayer?.id ? { ...player, role } : player
            )
        );
        setDirty(true);
    };

    const updateSlider = (
        setter: (value: number) => void,
        value: number
    ) => {
        setter(value);
        setDirty(true);
    };

    const replaceSelectedPlayer = (databasePlayer: Player) => {
        if (!selectedPlayer) return;

        setPlayers((current) =>
            current.map((player) =>
                player.id === selectedPlayer.id
                    ? {
                        ...player,
                        name: databasePlayer.name,
                        role: "Dengeli",
                        empty: false,
                        databaseId: databasePlayer.id,
                        club: databasePlayer.club,
                        rating: databasePlayer.rating,
                        sourcePosition: databasePlayer.position,
                        image: databasePlayer.image,
                        imageSprite: databasePlayer.imageSprite,
                    }
                    : player
            )
        );
        setDatabaseOpen(false);
        setDirty(true);
        toast.success(`${databasePlayer.name} kadroya eklendi`, {
            description: `${selectedPlayer.position} saha konumuna yerleştirildi.`,
        });
    };

    const removeSelectedPlayer = () => {
        if (!selectedPlayer || selectedPlayer.empty) return;

        const removedName = selectedPlayer.name;
        setPlayers((current) =>
            current.map((player) =>
                player.id === selectedPlayer.id
                    ? {
                        ...player,
                        name: "Oyuncu ekle",
                        role: "Dengeli",
                        empty: true,
                        databaseId: undefined,
                        club: undefined,
                        rating: undefined,
                        sourcePosition: undefined,
                        image: undefined,
                        imageSprite: undefined,
                    }
                    : player
            )
        );
        setDatabaseOpen(false);
        setDirty(true);
        toast(`${removedName} kadrodan çıkarıldı`, {
            description: `${selectedPlayer.position} konumu yeniden oyuncu eklemeye hazır.`,
        });
    };

    const createSquadImage = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = 1080;
        canvas.height = 1350;
        const context = canvas.getContext("2d");
        if (!context) throw new Error("Görsel oluşturucu açılamadı");

        const navy = "#071522";
        const yellow = "#f7e81c";
        const cyan = "#8ce9df";
        const fieldX = 55;
        const fieldY = 150;
        const fieldWidth = 970;
        const fieldHeight = 1145;

        const drawRoundedRect = (
            x: number,
            y: number,
            widthValue: number,
            heightValue: number,
            radius: number
        ) => {
            const safeRadius = Math.min(radius, widthValue / 2, heightValue / 2);
            context.beginPath();
            context.moveTo(x + safeRadius, y);
            context.lineTo(x + widthValue - safeRadius, y);
            context.quadraticCurveTo(
                x + widthValue,
                y,
                x + widthValue,
                y + safeRadius
            );
            context.lineTo(x + widthValue, y + heightValue - safeRadius);
            context.quadraticCurveTo(
                x + widthValue,
                y + heightValue,
                x + widthValue - safeRadius,
                y + heightValue
            );
            context.lineTo(x + safeRadius, y + heightValue);
            context.quadraticCurveTo(
                x,
                y + heightValue,
                x,
                y + heightValue - safeRadius
            );
            context.lineTo(x, y + safeRadius);
            context.quadraticCurveTo(x, y, x + safeRadius, y);
            context.closePath();
        };

        const fitText = (text: string, maxWidth: number) => {
            if (context.measureText(text).width <= maxWidth) return text;
            let shortened = text;
            while (
                shortened.length > 2 &&
                context.measureText(`${shortened}…`).width > maxWidth
            ) {
                shortened = shortened.slice(0, -1);
            }
            return `${shortened}…`;
        };

        const background = context.createLinearGradient(0, 0, 0, canvas.height);
        background.addColorStop(0, "#0d2037");
        background.addColorStop(1, navy);
        context.fillStyle = background;
        context.fillRect(0, 0, canvas.width, canvas.height);

        context.fillStyle = yellow;
        context.font = "900 23px Arial";
        context.letterSpacing = "3px";
        context.fillText("FENER AJANS · İLK 11", 55, 57);
        context.letterSpacing = "0px";
        context.fillStyle = "#ffffff";
        context.font = "900 43px Arial";
        context.fillText(formation, 55, 108);
        context.fillStyle = "#8ca0b8";
        context.font = "700 19px Arial";
        context.textAlign = "right";
        context.fillText(`${activeModel?.label ?? "Taktik"} · ${phase}`, 1025, 96);
        context.textAlign = "left";

        drawRoundedRect(fieldX, fieldY, fieldWidth, fieldHeight, 28);
        context.save();
        context.clip();
        const pitchGradient = context.createLinearGradient(
            fieldX,
            fieldY,
            fieldX,
            fieldY + fieldHeight
        );
        pitchGradient.addColorStop(0, "#11665a");
        pitchGradient.addColorStop(1, "#0a453d");
        context.fillStyle = pitchGradient;
        context.fillRect(fieldX, fieldY, fieldWidth, fieldHeight);

        const stripeHeight = fieldHeight / 10;
        for (let index = 0; index < 10; index += 1) {
            if (index % 2 === 0) {
                context.fillStyle = "rgba(255,255,255,0.025)";
                context.fillRect(
                    fieldX,
                    fieldY + index * stripeHeight,
                    fieldWidth,
                    stripeHeight
                );
            }
        }
        context.restore();

        context.strokeStyle = "rgba(225,255,246,0.68)";
        context.lineWidth = 3;
        drawRoundedRect(fieldX + 18, fieldY + 18, fieldWidth - 36, fieldHeight - 36, 12);
        context.stroke();

        const innerX = fieldX + 18;
        const innerY = fieldY + 18;
        const innerWidth = fieldWidth - 36;
        const innerHeight = fieldHeight - 36;
        context.beginPath();
        context.moveTo(innerX, innerY + innerHeight / 2);
        context.lineTo(innerX + innerWidth, innerY + innerHeight / 2);
        context.stroke();
        context.beginPath();
        context.arc(
            innerX + innerWidth / 2,
            innerY + innerHeight / 2,
            112,
            0,
            Math.PI * 2
        );
        context.stroke();
        context.fillStyle = "rgba(225,255,246,0.8)";
        context.beginPath();
        context.arc(
            innerX + innerWidth / 2,
            innerY + innerHeight / 2,
            6,
            0,
            Math.PI * 2
        );
        context.fill();

        const penaltyWidth = innerWidth * 0.58;
        const penaltyHeight = innerHeight * 0.15;
        context.strokeRect(
            innerX + (innerWidth - penaltyWidth) / 2,
            innerY,
            penaltyWidth,
            penaltyHeight
        );
        context.strokeRect(
            innerX + (innerWidth - penaltyWidth) / 2,
            innerY + innerHeight - penaltyHeight,
            penaltyWidth,
            penaltyHeight
        );

        displayPlayers.forEach((player) => {
            const x = fieldX + (player.x / 100) * fieldWidth;
            const y = fieldY + (player.y / 100) * fieldHeight;

            context.save();
            context.shadowColor = "rgba(0,0,0,0.38)";
            context.shadowBlur = 16;
            context.shadowOffsetY = 7;
            context.fillStyle = navy;
            context.beginPath();
            context.arc(x, y, 42, 0, Math.PI * 2);
            context.fill();
            context.restore();

            if (player.empty) {
                context.strokeStyle = yellow;
                context.lineWidth = 4;
                context.setLineDash([7, 6]);
                context.beginPath();
                context.arc(x, y, 34, 0, Math.PI * 2);
                context.stroke();
                context.setLineDash([]);
                context.beginPath();
                context.moveTo(x - 11, y);
                context.lineTo(x + 11, y);
                context.moveTo(x, y - 11);
                context.lineTo(x, y + 11);
                context.stroke();
            } else {
                context.fillStyle = yellow;
                context.strokeStyle = "#0b2441";
                context.lineWidth = 4;
                context.beginPath();
                context.moveTo(x - 17, y - 26);
                context.lineTo(x - 39, y - 14);
                context.lineTo(x - 30, y + 5);
                context.lineTo(x - 20, y);
                context.lineTo(x - 20, y + 31);
                context.lineTo(x + 20, y + 31);
                context.lineTo(x + 20, y);
                context.lineTo(x + 30, y + 5);
                context.lineTo(x + 39, y - 14);
                context.lineTo(x + 17, y - 26);
                context.quadraticCurveTo(x, y - 13, x - 17, y - 26);
                context.closePath();
                context.fill();
                context.stroke();
            }

            context.font = "900 17px Arial";
            const playerName = fitText(
                player.empty ? "OYUNCU EKLE" : player.name,
                176
            );
            const labelWidth = Math.max(84, context.measureText(playerName).width + 24);
            drawRoundedRect(x - labelWidth / 2, y + 48, labelWidth, 31, 8);
            context.fillStyle = "rgba(5,17,29,0.94)";
            context.fill();
            context.fillStyle = "#ffffff";
            context.textAlign = "center";
            context.fillText(playerName, x, y + 70);
            context.fillStyle = cyan;
            context.font = "900 13px Arial";
            context.fillText(player.position, x, y + 96);
            context.textAlign = "left";
        });

        context.fillStyle = "rgba(255,255,255,0.48)";
        context.font = "700 14px Arial";
        context.textAlign = "right";
        context.fillText("fenerajans · taktik lab", 1025, 1322);
        context.textAlign = "left";

        return new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((blob) => {
                if (blob) resolve(blob);
                else reject(new Error("PNG oluşturulamadı"));
            }, "image/png");
        });
    };

    const copySquadImage = async () => {
        try {
            if (!navigator.clipboard?.write || typeof ClipboardItem === "undefined") {
                throw new Error("Görsel panosu desteklenmiyor");
            }

            const image = await createSquadImage();
            await navigator.clipboard.write([
                new ClipboardItem({ "image/png": image }),
            ]);
            toast.success("İlk 11 görseli panoya kopyalandı", {
                description: "Mesajlara veya görsel düzenleyiciye yapıştırabilirsin.",
            });
        } catch {
            toast.error("Görsel kopyalanamadı", {
                description: "PNG indirmek için Kaydet düğmesini kullanabilirsin.",
            });
        }
    };

    const saveSquadImage = async () => {
        persistPlan();

        try {
            const image = await createSquadImage();
            const url = URL.createObjectURL(image);
            const anchor = document.createElement("a");
            anchor.href = url;
            anchor.download = `fener-ajans-ilk-11-${formation}.png`;
            document.body.appendChild(anchor);
            anchor.click();
            anchor.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1000);

            toast.success("İlk 11 görseli PNG olarak indirildi", {
                description: `${formation} planın bu cihazda da kaydedildi.`,
            });
        } catch {
            toast.error("Plan kaydedildi fakat görsel indirilemedi");
        }
    };

    const activeModel = MODELS.find((item) => item.id === model);

    return (
        <Tooltip.Provider delayDuration={250}>
            <main className={styles.shell}>
                <Toaster
                    theme="dark"
                    position="bottom-right"
                    toastOptions={{
                        style: {
                            background: "#101c30",
                            border: "1px solid #29415f",
                            color: "#f8fbff",
                        },
                    }}
                />

                <div className={styles.ambientOne} />
                <div className={styles.ambientTwo} />

                <header className={styles.pageHeader}>
                    <div className={styles.headerCopy}>
                        <div className={styles.eyebrow}>
                            <Sparkles size={14} />
                            Fener Ajans Taktik Lab
                        </div>
                        <h1>Maç planını burada kur.</h1>
                        <p>
                            Dizilişi seç, oyun modelini uygula, oyuncuları sürükle ve
                            takımının canlı taktik profilini incele.
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <div className={styles.liveStatus}>
                            <span className={dirty ? styles.statusDirty : ""} />
                            {dirty ? "Kaydedilmemiş değişiklik" : "Plan güncel"}
                        </div>
                        <button
                            type="button"
                            className={styles.databaseHeaderButton}
                            onClick={() => setDatabaseOpen(true)}
                        >
                            <UserPlus size={17} />
                            Oyuncu ekle
                        </button>
                        <IconAction label="İlk 11 görselini kopyala" onClick={copySquadImage}>
                            <Copy size={18} />
                        </IconAction>
                        <IconAction label="Planı sıfırla" onClick={resetPlan}>
                            <RotateCcw size={19} />
                        </IconAction>
                        <IconAction
                            label="İlk 11 görselini PNG olarak kaydet"
                            onClick={saveSquadImage}
                            primary
                        >
                            <Download size={19} />
                        </IconAction>
                    </div>
                </header>

                <section className={styles.workspace}>
                    <aside className={`${styles.panel} ${styles.controlsPanel}`}>
                        <div className={styles.panelHeading}>
                            <div>
                                <span className={styles.sectionIndex}>01</span>
                                <h2>Oyun planı</h2>
                            </div>
                            <Gauge size={20} />
                        </div>

                        <div className={styles.controlBlock}>
                            <label className={styles.fieldLabel}>Diziliş</label>
                            <div className={styles.formationGrid}>
                                {Object.keys(formations).map((item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        onClick={() => handleFormation(item)}
                                        className={formation === item ? styles.optionActive : styles.option}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.controlBlock}>
                            <label className={styles.fieldLabel}>Oyun modeli</label>
                            <div className={styles.modelList}>
                                {MODELS.map((item) => (
                                    <button
                                        type="button"
                                        key={item.id}
                                        onClick={() => handleModel(item.id)}
                                        className={model === item.id ? styles.modelActive : styles.model}
                                    >
                                        <span className={styles.modelRadio}>
                                            {model === item.id && <Check size={12} />}
                                        </span>
                                        <span>
                                            <strong>{item.label}</strong>
                                            <small>{item.detail}</small>
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.sliders}>
                            <SliderControl
                                label="Tempo"
                                value={tempo}
                                low="Sabırlı"
                                high="Hızlı"
                                onChange={(value) => updateSlider(setTempo, value)}
                            />
                            <SliderControl
                                label="Takım genişliği"
                                value={width}
                                low="Dar"
                                high="Geniş"
                                onChange={(value) => updateSlider(setWidth, value)}
                            />
                            <SliderControl
                                label="Savunma çizgisi"
                                value={line}
                                low="Derin"
                                high="Önde"
                                onChange={(value) => updateSlider(setLine, value)}
                            />
                        </div>

                        <div className={styles.modelSummary}>
                            <Zap size={18} />
                            <div>
                                <strong>{activeModel?.label} planı</strong>
                                <span>{formation} yerleşiminde dengeli başlangıç</span>
                            </div>
                        </div>
                    </aside>

                    <section className={`${styles.panel} ${styles.pitchPanel}`}>
                        <div className={styles.pitchToolbar}>
                            <div>
                                <span className={styles.sectionIndex}>02</span>
                                <h2>Saha yerleşimi</h2>
                            </div>

                            <div className={styles.phaseTabs} aria-label="Oyun fazı">
                                {PHASES.map((item) => (
                                    <button
                                        type="button"
                                        key={item}
                                        onClick={() => handlePhase(item)}
                                        className={phase === item ? styles.phaseActive : styles.phase}
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className={styles.pitchStage}>
                            <div className={styles.dragHint}>
                                <Move size={15} />
                                Oyuncuları sürükleyerek planı değiştir
                            </div>

                            <div className={styles.pitch} ref={pitchRef} data-phase={phase}>
                                <div className={styles.pitchGlow} />
                                <div className={styles.phaseBanner}>
                                    <span>{PHASE_COPY[phase].title}</span>
                                    <strong>{PHASE_COPY[phase].detail}</strong>
                                </div>
                                <div className={styles.fieldLines}>
                                    <span className={styles.centerLine} />
                                    <span className={styles.centerCircle} />
                                    <span className={styles.centerDot} />
                                    <span className={styles.topBox} />
                                    <span className={styles.topGoalBox} />
                                    <span className={styles.bottomBox} />
                                    <span className={styles.bottomGoalBox} />
                                </div>

                                <DndContext
                                    id="planner-studio-pitch"
                                    sensors={sensors}
                                    onDragEnd={handleDragEnd}
                                >
                                    {displayPlayers.map((player) => (
                                        <DraggablePlayer
                                            key={player.id}
                                            player={player}
                                            selected={player.id === selectedPlayer?.id}
                                            onSelect={() => {
                                                setSelectedId(player.id);
                                                if (player.empty) setDatabaseOpen(true);
                                            }}
                                        />
                                    ))}
                                </DndContext>
                            </div>
                        </div>

                        <div className={styles.squadManager}>
                            <div className={styles.squadManagerIcon}>
                                <Database size={20} />
                            </div>
                            <div className={styles.squadManagerCopy}>
                                <span>OYUNCU VERİTABANI</span>
                                <strong>
                                    {players.filter((player) => !player.empty).length}/11 saha
                                    konumu dolu
                                </strong>
                                <small>
                                    {PLAYER_COUNT.toLocaleString("tr-TR")} oyuncu içinde ara,
                                    seçili konuma ekle veya değiştir.
                                </small>
                            </div>
                            <button
                                type="button"
                                className={styles.squadManagerButton}
                                onClick={() => setDatabaseOpen(true)}
                            >
                                <UserPlus size={16} />
                                Veritabanını aç
                            </button>
                        </div>
                    </section>

                    <aside className={`${styles.panel} ${styles.insightPanel}`}>
                        <div className={styles.panelHeading}>
                            <div>
                                <span className={styles.sectionIndex}>03</span>
                                <h2>Analiz</h2>
                            </div>
                            <CircleDot size={20} />
                        </div>

                        {selectedPlayer && (
                            <div className={styles.selectedCard}>
                                <div className={styles.selectedTop}>
                                    <span className={styles.selectedAvatar}>
                                        {selectedPlayer.empty ? (
                                            <UserPlus size={20} />
                                        ) : (
                                            <span className={styles.selectedJersey}>
                                                <Shirt
                                                    size={38}
                                                    strokeWidth={1.8}
                                                    aria-hidden="true"
                                                />
                                            </span>
                                        )}
                                    </span>
                                    <div>
                                        <small>Seçili saha konumu</small>
                                        <strong>
                                            {selectedPlayer.empty
                                                ? `${selectedPlayer.position} · Oyuncu yok`
                                                : selectedPlayer.name}
                                        </strong>
                                        <span>
                                            {selectedPlayer.empty
                                                ? "Veritabanından bir oyuncu ekle"
                                                : `${selectedPlayer.position}${selectedPlayer.club ? ` · ${selectedPlayer.club}` : ""}`}
                                        </span>
                                    </div>
                                </div>
                                <div className={styles.playerManagementActions}>
                                    <button
                                        type="button"
                                        className={styles.changePlayerButton}
                                        onClick={() => setDatabaseOpen(true)}
                                    >
                                        {selectedPlayer.empty ? (
                                            <UserPlus size={15} />
                                        ) : (
                                            <RefreshCw size={15} />
                                        )}
                                        {selectedPlayer.empty ? "Oyuncu ekle" : "Değiştir"}
                                    </button>
                                    {!selectedPlayer.empty && (
                                        <button
                                            type="button"
                                            className={styles.removePlayerButton}
                                            onClick={removeSelectedPlayer}
                                        >
                                            <Trash2 size={15} />
                                            Kaldır
                                        </button>
                                    )}
                                </div>
                                {!selectedPlayer.empty && (
                                    <label className={styles.roleField}>
                                        <span>Rol</span>
                                        <select
                                            value={selectedPlayer.role}
                                            onChange={(event) =>
                                                updateSelectedRole(event.target.value)
                                            }
                                        >
                                            {ROLE_OPTIONS.map((role) => (
                                                <option key={role} value={role}>
                                                    {role}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                )}
                            </div>
                        )}

                        <div className={styles.scoreGrid}>
                            <div className={styles.scoreCard}>
                                <span>Kontrol</span>
                                <strong>{metrics.control}</strong>
                                <div><i style={{ width: `${metrics.control}%` }} /></div>
                            </div>
                            <div className={styles.scoreCard}>
                                <span>Geçiş</span>
                                <strong>{metrics.transition}</strong>
                                <div><i style={{ width: `${metrics.transition}%` }} /></div>
                            </div>
                            <div className={styles.scoreCard}>
                                <span>Kompaktlık</span>
                                <strong>{metrics.compactness}</strong>
                                <div><i style={{ width: `${metrics.compactness}%` }} /></div>
                            </div>
                        </div>

                        <div className={styles.radarCard}>
                            <div className={styles.radarTitle}>
                                <span>CANLI TAKTİK PROFİLİ</span>
                                <BarChartLabel value={Math.round((metrics.control + metrics.transition + metrics.compactness) / 3)} />
                            </div>
                            <div className={styles.radarChart}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={radarData} outerRadius="68%">
                                        <PolarGrid stroke="rgba(119, 149, 181, 0.25)" />
                                        <PolarAngleAxis
                                            dataKey="metric"
                                            tick={{ fill: "#758aa2", fontSize: 8, fontWeight: 700 }}
                                        />
                                        <Radar
                                            dataKey="value"
                                            stroke="#f7e81c"
                                            fill="#f7e81c"
                                            fillOpacity={0.15}
                                            strokeWidth={2}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className={styles.insightList}>
                            <article>
                                <span className={styles.insightIcon}>
                                    <Target size={17} />
                                </span>
                                <div>
                                    <strong>{PHASE_COPY[phase].title}</strong>
                                    <p>{PHASE_COPY[phase].detail}</p>
                                </div>
                            </article>
                            <article>
                                <span className={styles.insightIcon}>
                                    <ShieldCheck size={17} />
                                </span>
                                <div>
                                    <strong>Rest defence</strong>
                                    <p>
                                        {line > 70
                                            ? "Çizgi agresif; top kaybında stoper arkası riskli."
                                            : "Savunma mesafesi kontrollü ve dengeli."}
                                    </p>
                                </div>
                            </article>
                        </div>

                        {reportOpen && (
                            <div className={styles.reportPanel}>
                                <strong><FileText size={15} /> Teknik ekip notu</strong>
                                <p>
                                    {model === "pres"
                                        ? "Ön alan baskısı güçlü; ilk pres kırılırsa savunma arkası için bir süpürücü rolü önerilir."
                                        : model === "dikey"
                                            ? "Dikey çıkış temposu yüksek. Merkez oyunculardan birini dengeli rolde tutmak geçiş güvenliği sağlar."
                                            : "Topa sahip olma yapısı dengeli. Genişliği 65 üzerine çıkarmak kanat izolasyonlarını artırır."}
                                </p>
                            </div>
                        )}

                        <button
                            type="button"
                            className={styles.reportButton}
                            onClick={() => setReportOpen((value) => !value)}
                            aria-expanded={reportOpen}
                        >
                            {reportOpen ? "Raporu kapat" : "Teknik raporu aç"}
                            <ArrowUpRight size={18} />
                        </button>
                    </aside>
                </section>
            </main>

            <PlannerPlayerDatabase
                open={databaseOpen}
                position={selectedPlayer?.position}
                currentPlayerId={selectedPlayer?.databaseId}
                canRemove={Boolean(selectedPlayer && !selectedPlayer.empty)}
                onClose={() => setDatabaseOpen(false)}
                onSelect={replaceSelectedPlayer}
                onRemove={removeSelectedPlayer}
            />
        </Tooltip.Provider>
    );
}

function BarChartLabel({ value }: { value: number }) {
    return <strong>{value}/100</strong>;
}
