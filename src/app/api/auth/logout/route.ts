import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
    // Limpar o cookie de sessão
    cookies().delete('admin_session');

    // Retornar sucesso
    return NextResponse.json({ success: true });
} 