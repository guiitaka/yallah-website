import { NextResponse } from 'next/server';
import { auth } from '@/utils/firebase-admin';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        // Validate input
        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Server-side credential check
        if (email !== process.env.ADMIN_USERNAME || password !== process.env.ADMIN_PASSWORD) {
            return NextResponse.json(
                { error: 'Invalid credentials' },
                { status: 401 }
            );
        }

        // Create a custom token for Firebase Auth
        const customToken = await auth.createCustomToken(email);

        // Set secure HTTP-only cookie
        cookies().set('admin_session', customToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 2, // 2 hours
            path: '/',
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Authentication error:', error);
        return NextResponse.json(
            { error: 'Authentication failed' },
            { status: 500 }
        );
    }
} 