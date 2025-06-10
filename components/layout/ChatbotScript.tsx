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
                strategy="lazyOnload"
            />
            <style jsx global>{`
                @media (max-width: 768px) {
                    /* Hide the chatbot on mobile devices */
                    #JotformAgent-0197336e623672dd8656ec15d26e4d3ec9f7,
                    #JotformAgent-0197336e623672dd8656ec15d26e4d3ec9f7 .embedded-agent-container,
                    #JotformAgent-0197336e623672dd8656ec15d26e4d3ec9f7 .ai-agent-chat-avatar-pulse-wrapper {
                        display: none;
                    }
                }
            `}</style>
        </>
    );
}
