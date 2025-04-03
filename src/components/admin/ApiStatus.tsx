'use client';

import React, { useState, useEffect } from 'react';
import { checkScraperStatus } from '@/utils/airbnb-scraper';
import { Info } from 'lucide-react';

export function ApiStatusIndicator() {
    const [status, setStatus] = useState<{
        online: boolean;
        status: number;
        message: string;
    } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        async function checkStatus() {
            try {
                setLoading(true);
                setError(null);
                const result = await checkScraperStatus();
                setStatus(result);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Erro ao verificar API');
                setStatus(null);
            } finally {
                setLoading(false);
            }
        }

        checkStatus();
        // Verificar status a cada 5 minutos
        const interval = setInterval(checkStatus, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="flex items-center space-x-1 text-xs">
                <div className="w-2 h-2 rounded-full bg-gray-300 animate-pulse"></div>
                <span className="text-gray-400">Verificando API...</span>
            </div>
        );
    }

    if (error || !status) {
        return (
            <div className="flex items-center space-x-1 text-xs relative">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span className="text-red-500">API indisponível</span>
                <div
                    className="ml-1 cursor-help"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                >
                    <Info size={12} className="text-gray-400" />

                    {showTooltip && (
                        <div className="absolute right-0 bottom-full mb-2 bg-white p-2 rounded shadow-lg text-xs w-64 z-50">
                            <p className="text-gray-700 font-medium">Detalhes do Erro:</p>
                            <p className="text-red-500">{error || 'API de scraping indisponível'}</p>
                            <p className="text-gray-600 mt-1">
                                O sistema está usando um simulador para demonstração. O scraping real do Airbnb não está disponível no momento.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-1 text-xs relative">
            <div className={`w-2 h-2 rounded-full ${status.online ? 'bg-green-500' : 'bg-red-500'}`}></div>
            <span className={status.online ? 'text-green-500' : 'text-red-500'}>
                {status.online ? 'API conectada' : 'API offline'}
            </span>
            <div
                className="ml-1 cursor-help"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <Info size={12} className="text-gray-400" />

                {showTooltip && (
                    <div className="absolute right-0 bottom-full mb-2 bg-white p-2 rounded shadow-lg text-xs w-64 z-50">
                        <p className="text-gray-700 font-medium">Status da API:</p>
                        <p className={status.online ? 'text-green-500' : 'text-red-500'}>
                            {status.message} (HTTP {status.status})
                        </p>
                        <p className="text-gray-600 mt-1">
                            {status.online
                                ? 'A API de scraping está disponível e funcionando corretamente.'
                                : 'Usando simulador para demonstração. O scraping real não está disponível.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
} 