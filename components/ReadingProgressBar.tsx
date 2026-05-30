"use client";

import React, {useEffect, useState} from "react";

export const ReadingProgressBar: React.FC = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const currentProgress = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight > 0) {
                setProgress(Number((currentProgress / scrollHeight).toFixed(3)) * 100);
            }
        };
        window.addEventListener("scroll", updateProgress, { passive: true });
        return () => window.removeEventListener("scroll", updateProgress);
    }, []);

    return (
        <div
            className="fixed top-0 left-0 h-0.75 bg-primary z-100 transition-all duration-75 ease-out opacity-80"
            style={{width: `${progress}%`}}
        />
    );
};
