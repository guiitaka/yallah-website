import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const sessionCookie = cookies().get('admin_session')?.value;

        if (!sessionCookie) {
            return NextResponse.json({ isAuthenticated: false }, { status: 401 });
        }

        // Verifique o token com o Firebase
        // Nota: Este método requer o uso de Firebase Admin SDK no lado do servidor
        // Para implementação completa, seria necessário instalar firebase-admin
        // e verificar o token adequadamente

        // Por enquanto, apenas verificamos se o cookie existe
        return NextResponse.json({ isAuthenticated: true });
    } catch (error) {
        console.error('Error verifying session:', error);
        return NextResponse.json({ isAuthenticated: false, error: 'Failed to verify session' }, { status: 500 });
    }
} 