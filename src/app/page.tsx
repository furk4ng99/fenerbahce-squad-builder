import fs from "fs";
import path from "path";
import { formations } from "@/data/formations";
import { HomeExperience } from "@/components/HomeExperience";

function getPlayerCount() {
    try {
        type CountablePlayer = {
            name: string;
            position: string;
            club?: string;
        };
        const readPlayers = (fileName: string) => {
            const dataPath = path.join(process.cwd(), "public", "data", fileName);
            const parsed = JSON.parse(fs.readFileSync(dataPath, "utf8")) as {
                players?: CountablePlayer[];
            };
            return parsed.players ?? [];
        };
        const normalize = (value: string) =>
            value
                .toLocaleLowerCase("tr-TR")
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/ı/g, "i");
        const identities = new Set(
            [...readPlayers("fenerbahce-players.json"), ...readPlayers("global-players.json")]
                .map((player) =>
                    [
                        normalize(player.name),
                        player.position,
                        normalize(player.club ?? ""),
                    ].join("|")
                )
        );
        return identities.size;
    } catch {
        return 0;
    }
}

export default function HomePage() {
    return (
        <HomeExperience
            playerCount={getPlayerCount()}
            formationCount={Object.keys(formations).length}
        />
    );
}
