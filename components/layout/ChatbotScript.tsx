'use client';

import { usePathname } from 'next/navigation';
import Script from 'next/script';

export default function ChatbotScript() {
    const pathname = usePathname();

    if (pathname === '/') {
        return null; // Don't render the script on the splash screen
    }

    return (
        <>
            <Script
                src='https://cdn.jotfor.ms/agent/embedjs/0197336e623672dd8656ec15d26e4d3ec9f7/embed.js?skipWelcome=1&maximizable=1'
                strategy="lazyOnload" // Or "afterInteractive" depending on when you want it to load
            />
            <style jsx global>{`
                @media (max-width: 768px) {
                    #JotformAgent-0197336e623672dd8656ec15d26e4d3ec9f7,
                    .embedded-agent-container,
                    .ai-agent-chat-avatar-pulse-wrapper {
                        bottom: 40px !important;
                    }
                    
                    /* Fix speech bubble z-index to appear in front */
                    .ai-agent-chat-avatar-container .ai-agent-chat-balloon,
                    .ai-agent-chat-balloon,
                    .chat-balloon,
                    .speech-bubble,
                    [class*="balloon"],
                    [class*="bubble"],
                    [class*="tooltip"] {
                        z-index: 9999 !important;
                        position: relative !important;
                        transform: translateY(-30px) !important;
                    }
                }
            `}</style>
        </>
    );
} 