// Verificar se as variáveis de ambiente estão definidas
export function validateFirebaseConfig() {
    if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY) {
        console.error('NEXT_PUBLIC_FIREBASE_API_KEY não está definido');
    }
    if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
        console.error('NEXT_PUBLIC_FIREBASE_PROJECT_ID não está definido');
    }
    // Retorna objeto com status das variáveis
    return {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'não definido',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'não definido',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'não definido'
    };
} 