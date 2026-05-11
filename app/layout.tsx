import type {Metadata} from "next";
import {IBM_Plex_Mono, Libre_Baskerville, Lora} from "next/font/google";
import "./globals.css";
import React from "react";
import {ThemeProvider} from "@/components/theme-provider";
import {ModeToggle} from "@/components/toggle-theme";

const libreBaskerville = Libre_Baskerville({
    weight: ["400", "700"],
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const lora = Lora({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
    weight: ["400", "500", "600", "700"],
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "MindCanvas | Curated Ideas & Articles",
        template: "%s | MindCanvas"
    },
    description: "Explore a curated collection of articles across diverse topics. Discover insights, knowledge, and inspiration in every canvas.",
    keywords: ["blog", "articles", "knowledge", "learning", "mindcanvas"],
    authors: [{name: "Ajith Goveas"}],
    creator: "Ajith Goveas",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://mindcanvas.vercel.app", // Placeholder, update if you have a real domain
        title: "MindCanvas | Curated Ideas & Articles",
        description: "Explore a curated collection of articles across diverse topics.",
        siteName: "MindCanvas",
    },
    twitter: {
        card: "summary_large_image",
        title: "MindCanvas",
        description: "Explore a curated collection of articles across diverse topics.",
    },
    robots: {
        index: true,
        follow: true,
    }
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`
            ${libreBaskerville.variable}
            ${lora.variable}
            ${ibmPlexMono.variable} 
          antialiased`}
        >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            {children}
        </ThemeProvider>
        </body>
        </html>
    );
}