import * as admin from 'firebase-admin';

function getFirebaseAdminConfig() {
    try {
        // Obter as variáveis de configuração
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        let privateKey = process.env.FIREBASE_PRIVATE_KEY || '';

        if (!projectId || !clientEmail) {
            throw new Error('Variáveis FIREBASE_PROJECT_ID e FIREBASE_CLIENT_EMAIL são obrigatórias');
        }

        // Processar a chave privada
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            // Remover aspas extras se estiverem presentes
            privateKey = privateKey.slice(1, -1);
        }

        if (privateKey.includes('\\n')) {
            // Substituir literais \n por quebras de linha reais
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        console.log('Iniciando Firebase Admin com:', { projectId, clientEmail, privateKeyLength: privateKey.length });

        return {
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            })
        };
    } catch (error: any) {
        console.error('Erro de configuração Firebase Admin:', error);
        throw error;
    }
}

// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        admin.initializeApp(getFirebaseAdminConfig());
        console.log('Firebase Admin inicializado com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar Firebase Admin:', error);
        throw error;
    }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage(); 