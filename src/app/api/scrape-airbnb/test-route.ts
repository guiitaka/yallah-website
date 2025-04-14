import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Test endpoint for scraper functionality
 * This endpoint can be used to check if the scraper's environment is correctly configured
 */
export async function GET() {
    try {
        // Check that puppeteer and required dependencies are available
        const puppeteerVersion = require('puppeteer-core/package.json').version;
        const chromiumVersion = require('@sparticuz/chromium/package.json').version;

        // Check for environment variables
        const nodeEnv = process.env.NODE_ENV || 'undefined';
        const runtimeEnv = process.env.VERCEL_ENV || process.env.RENDER_ENV || 'local';

        // Return diagnostics
        return NextResponse.json({
            status: 'ok',
            message: 'Scraper test endpoint is functioning correctly',
            environment: {
                nodeEnv,
                runtimeEnv,
                nodeVersion: process.version,
                platform: process.platform,
                architecture: process.arch
            },
            dependencies: {
                puppeteerVersion,
                chromiumVersion
            }
        });
    } catch (error: any) {
        console.error('Error in test endpoint:', error);

        return NextResponse.json({
            status: 'error',
            message: 'There was an error with the scraper test endpoint',
            error: error.message || 'Unknown error'
        }, { status: 500 });
    }
} 