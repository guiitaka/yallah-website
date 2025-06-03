'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function ChatbotScript() {
    const pathname = usePathname();

    if (pathname === '/') {
        return null; // Don't render the script on the splash screen
    }

    return (
        <Script
            src='https://cdn.jotfor.ms/agent/embedjs/0197336e623672dd8656ec15d26e4d3ec9f7/embed.js?skipWelcome=1&maximizable=1'
            strategy="lazyOnload" // Or "afterInteractive" depending on when you want it to load
        />
    );
} 