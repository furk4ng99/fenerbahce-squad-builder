// Duel Player Data with dummy stats derived from actual image filenames
// Categories: Legends, Strikers, Midfielders, Defenders, Goalkeepers

export interface DuelPlayer {
    id: string;
    name: string;
    image: string;
    position: string;
    era: string;
    apps: number;
    goals: number;
    trophies: number;
    category: 'Legends' | 'Strikers' | 'Midfielders' | 'Defenders' | 'Goalkeepers';
}

// Helper to generate dummy stats
const generateStats = (isStriker: boolean) => ({
    apps: Math.floor(Math.random() * 200) + 50,
    goals: isStriker ? Math.floor(Math.random() * 100) + 20 : Math.floor(Math.random() * 30),
    trophies: Math.floor(Math.random() * 8) + 1,
});

export const duelPlayers: DuelPlayer[] = [
    // Legends
    {
        id: 'alex-de-souza',
        name: 'Alex de Souza',
        image: '/data/fenerbahce-oyuncular/alex-de-souza-fenerbahce.jpeg',
        position: 'CAM',
        era: '2000s',
        ...generateStats(false),
        category: 'Legends',
    },
    {
        id: 'lefter',
        name: 'Lefter Küçükandonyadis',
        image: '/data/fenerbahce-oyuncular/lefter.jpeg',
        position: 'FW',
        era: '1950s',
        ...generateStats(true),
        category: 'Legends',
    },
    {
        id: 'ridvan-dilmen',
        name: 'Rıdvan Dilmen',
        image: '/data/fenerbahce-oyuncular/ridvan-dilmen.jpeg',
        position: 'AM',
        era: '1980s',
        ...generateStats(false),
        category: 'Legends',
    },
    {
        id: 'aykut-kocaman',
        name: 'Aykut Kocaman',
        image: '/data/fenerbahce-oyuncular/aykut-kocaman.jpeg',
        position: 'ST',
        era: '1990s',
        ...generateStats(true),
        category: 'Legends',
    },
    {
        id: 'oguz-cetin',
        name: 'Oğuz Çetin',
        image: '/data/fenerbahce-oyuncular/oguz-cetin.jpeg',
        position: 'DM',
        era: '1990s',
        ...generateStats(false),
        category: 'Legends',
    },
    {
        id: 'emre-belozoglu',
        name: 'Emre Belözoğlu',
        image: '/data/fenerbahce-oyuncular/emre-belozoglu.jpeg',
        position: 'CM',
        era: '2000s',
        ...generateStats(false),
        category: 'Legends',
    },

    // Strikers
    {
        id: 'pierre-van-hooijdonk',
        name: 'Pierre van Hooijdonk',
        image: '/data/fenerbahce-oyuncular/pierre-van-hooijdonk.jpeg',
        position: 'ST',
        era: '2000s',
        ...generateStats(true),
        category: 'Strikers',
    },
    {
        id: 'elvir-bolic',
        name: 'Elvir Bolić',
        image: '/data/fenerbahce-oyuncular/elvir-bolic.jpeg',
        position: 'ST',
        era: '1990s',
        ...generateStats(true),
        category: 'Strikers',
    },
    {
        id: 'robin-van-persie',
        name: 'Robin van Persie',
        image: '/data/fenerbahce-oyuncular/robin-van-persie-fenerbahce-sk.jpeg',
        position: 'ST',
        era: '2010s',
        ...generateStats(true),
        category: 'Strikers',
    },
    {
        id: 'moussa-sow',
        name: 'Moussa Sow',
        image: '/data/fenerbahce-oyuncular/moussa-sow.jpeg',
        position: 'ST',
        era: '2010s',
        ...generateStats(true),
        category: 'Strikers',
    },
    {
        id: 'anelka',
        name: 'Nicolas Anelka',
        image: '/data/fenerbahce-oyuncular/anelka.jpeg',
        position: 'ST',
        era: '2000s',
        ...generateStats(true),
        category: 'Strikers',
    },
    {
        id: 'dzeko',
        name: 'Edin Džeko',
        image: '/data/fenerbahce-oyuncular/dzeko.jpeg',
        position: 'ST',
        era: '2020s',
        ...generateStats(true),
        category: 'Strikers',
    },
    {
        id: 'tuncay-sanli',
        name: 'Tuncay Şanlı',
        image: '/data/fenerbahce-oyuncular/tuncay-sanli.jpeg',
        position: 'ST',
        era: '2000s',
        ...generateStats(true),
        category: 'Strikers',
    },

    // Midfielders
    {
        id: 'jay-jay-okocha',
        name: 'Jay-Jay Okocha',
        image: '/data/fenerbahce-oyuncular/jay-jay-okocha.jpeg',
        position: 'AM',
        era: '1990s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'stephen-appiah',
        name: 'Stephen Appiah',
        image: '/data/fenerbahce-oyuncular/stephen-appiah.jpeg',
        position: 'CM',
        era: '2000s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'dirk-kuyt',
        name: 'Dirk Kuyt',
        image: '/data/fenerbahce-oyuncular/dirk-kuyt.jpeg',
        position: 'RW',
        era: '2010s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'nani',
        name: 'Nani',
        image: '/data/fenerbahce-oyuncular/nani.jpeg',
        position: 'LW',
        era: '2010s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'mehmet-topal',
        name: 'Mehmet Topal',
        image: '/data/fenerbahce-oyuncular/mehmet-topal.jpeg',
        position: 'DM',
        era: '2010s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'szymanski',
        name: 'Sebastian Szymański',
        image: '/data/fenerbahce-oyuncular/szymanski.jpeg',
        position: 'AM',
        era: '2020s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'tadic',
        name: 'Dušan Tadić',
        image: '/data/fenerbahce-oyuncular/tadic.jpeg',
        position: 'LW',
        era: '2020s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'ismail-yuksek',
        name: 'İsmail Yüksek',
        image: '/data/fenerbahce-oyuncular/ismail-yuksek.jpeg',
        position: 'CM',
        era: '2020s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'arda-guler',
        name: 'Arda Güler',
        image: '/data/fenerbahce-oyuncular/arda-guler.jpeg',
        position: 'AM',
        era: '2020s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'kerem-akturkoglu',
        name: 'Kerem Aktürkoğlu',
        image: '/data/fenerbahce-oyuncular/kerem-akturkoglu.jpeg',
        position: 'LW',
        era: '2020s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'asensio',
        name: 'Marco Asensio',
        image: '/data/fenerbahce-oyuncular/asensio.jpeg',
        position: 'RW',
        era: '2020s',
        ...generateStats(false),
        category: 'Midfielders',
    },

    // Defenders
    {
        id: 'roberto-carlos',
        name: 'Roberto Carlos',
        image: '/data/fenerbahce-oyuncular/roberto-carlos.jpeg',
        position: 'LB',
        era: '2000s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'diego-lugano',
        name: 'Diego Lugano',
        image: '/data/fenerbahce-oyuncular/diego-lugano.jpeg',
        position: 'CB',
        era: '2000s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'joseph-yobo',
        name: 'Joseph Yobo',
        image: '/data/fenerbahce-oyuncular/joseph-yobo.jpeg',
        position: 'CB',
        era: '2000s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'uche-okechukwu',
        name: 'Uche Okechukwu',
        image: '/data/fenerbahce-oyuncular/uche-okechukwu.jpeg',
        position: 'CB',
        era: '1990s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'gokhan-gonul',
        name: 'Gökhan Gönül',
        image: '/data/fenerbahce-oyuncular/gokhan-gonul-fenerbahce.jpeg',
        position: 'RB',
        era: '2010s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'caner-erkin',
        name: 'Caner Erkin',
        image: '/data/fenerbahce-oyuncular/caner-erkin.jpeg',
        position: 'LB',
        era: '2010s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'kim-min-jae',
        name: 'Kim Min-Jae',
        image: '/data/fenerbahce-oyuncular/fenerbahce-kim-min-jae.jpeg',
        position: 'CB',
        era: '2020s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'ferdi-kadioglu',
        name: 'Ferdi Kadıoğlu',
        image: '/data/fenerbahce-oyuncular/ferdi-kadioglu-wallpaper.jpeg',
        position: 'LB',
        era: '2020s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'jayden-oosterwolde',
        name: 'Jayden Oosterwolde',
        image: '/data/fenerbahce-oyuncular/jayden-oosterwolde.jpeg',
        position: 'LB',
        era: '2020s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'skriniar',
        name: 'Milan Škriniar',
        image: '/data/fenerbahce-oyuncular/skriniar.jpeg',
        position: 'CB',
        era: '2020s',
        ...generateStats(false),
        category: 'Defenders',
    },

    // Goalkeepers
    {
        id: 'volkan-demirel',
        name: 'Volkan Demirel',
        image: '/data/fenerbahce-oyuncular/volkan-demirel.jpeg',
        position: 'GK',
        era: '2000s',
        ...generateStats(false),
        category: 'Goalkeepers',
    },
    {
        id: 'toni-schumacher',
        name: 'Toni Schumacher',
        image: '/data/fenerbahce-oyuncular/toni-schumacher.jpeg',
        position: 'GK',
        era: '1980s',
        ...generateStats(false),
        category: 'Goalkeepers',
    },

    // Additional players to reach 40
    {
        id: 'cristian-baroni',
        name: 'Cristian Baroni',
        image: '/data/fenerbahce-oyuncular/cristian-baroni-fenerbahce.jpeg',
        position: 'LB',
        era: '2000s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'andre-santos',
        name: 'André Santos',
        image: '/data/fenerbahce-oyuncular/andre-do-santos-brezilya-2009-2011.jpeg',
        position: 'LB',
        era: '2000s',
        ...generateStats(false),
        category: 'Defenders',
    },
    {
        id: 'david-de-souza',
        name: 'David de Souza',
        image: '/data/fenerbahce-oyuncular/david-de-souza.jpeg',
        position: 'CM',
        era: '2000s',
        ...generateStats(false),
        category: 'Midfielders',
    },
    {
        id: 'ismail-kartal',
        name: 'İsmail Kartal',
        image: '/data/fenerbahce-oyuncular/ismail-kartal.jpeg',
        position: 'DM',
        era: '1990s',
        ...generateStats(false),
        category: 'Legends',
    },
    {
        id: 'cristian',
        name: 'Cristian Oliveira',
        image: '/data/fenerbahce-oyuncular/cristian-baroni-fenerbahce.jpeg',
        position: 'AM',
        era: '2010s',
        ...generateStats(false),
        category: 'Midfielders',
    },
];

// Get a random duel pair, optionally filtered by category
export function getRandomDuelPair(
    category?: DuelPlayer['category'],
    excludeIds: string[] = []
): [DuelPlayer, DuelPlayer] | null {
    let pool = duelPlayers.filter((p) => !excludeIds.includes(p.id));

    if (category && category !== ('All' as any)) {
        pool = pool.filter((p) => p.category === category);
    }

    if (pool.length < 2) {
        // Reset if pool is too small
        pool = category && category !== ('All' as any)
            ? duelPlayers.filter((p) => p.category === category)
            : [...duelPlayers];
    }

    if (pool.length < 2) return null;

    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return [shuffled[0], shuffled[1]];
}

export type FilterCategory = 'All' | DuelPlayer['category'];

export const filterCategories: FilterCategory[] = [
    'All',
    'Legends',
    'Strikers',
    'Midfielders',
    'Defenders',
    'Goalkeepers',
];
