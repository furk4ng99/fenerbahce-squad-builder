"use client";

import { useEffect, useState } from "react";
import LoadingSplash from "./LoadingSplash";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Hide splash after 4.5 seconds (slightly longer than animation)
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 4500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {isLoading && <LoadingSplash />}
            {children}
        </>
    );
}
