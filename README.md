# Fenerbahçe Squad Builder 💛💙

A modern, responsive web application for Fenerbahçe fans to build their dream squads, simulate transfers, and analyze team stats.

## Features

*   **Squad Builder**: Drag and drop players into positions. Supports multiple formations (4-2-3-1, 4-3-3, 4-4-2, 3-5-2, etc.).
*   **Player Database**: Extensive database of players with ratings, values, and positions (Season 2025-2026 data).
*   **Transfer Market**: Filter players by position, view details, and "buy" them for your squad.
*   **Budget Management**: Manage a transfer budget and monitor squad value.
*   **Share Squad**: Download a high-quality image of your squad to share on social media.
*   **Community Hub**: Live visitor counter and latest tweets (simulated).

## Tech Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
*   **Animations**: [Framer Motion](https://www.framer.com/motion/)
*   **Icons**: [Lucide React](https://lucide.dev/)
*   **Screenshot**: [html2canvas](https://html2canvas.hertzen.com/)

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run the development server**:
    ```bash
    npm run dev
    ```

3.  **Open the app**:
    Navigate to [http://localhost:3000](http://localhost:3000).

## Project Structure

*   `src/app`: Next.js App Router pages.
*   `src/components`: Reusable UI components (Pitch, PlayerCard, etc.).
*   `src/store`: Zustand state management (`useSquadStore`).
*   `src/data`: Static data (formations, players JSON).
*   `src/types`: TypeScript interfaces.
*   `scripts`: Utility scripts (e.g., CSV importer).

## License

MIT
