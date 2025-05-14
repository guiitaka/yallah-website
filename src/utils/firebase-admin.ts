import * as admin from 'firebase-admin';

function getFirebaseAdminConfig() {
    try {
        // Verificar se temos um JSON completo de service account
        const serviceAccountStr = process.env.FIREBASE_SERVICE_ACCOUNT;
        if (serviceAccountStr) {
            try {
                // Tentar usar o JSON completo do service account
                const serviceAccount = JSON.parse(serviceAccountStr);
                return {
                    credential: admin.credential.cert(serviceAccount)
                };
            } catch (error) {
                console.error('Erro ao parsear FIREBASE_SERVICE_ACCOUNT:', error);
                // Continuar para o método alternativo se este falhar
            }
        }

        // Método alternativo usando as variáveis separadas
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        let privateKey = process.env.FIREBASE_PRIVATE_KEY;

        if (!projectId || !clientEmail || !privateKey) {
            throw new Error('Variáveis de ambiente do Firebase não configuradas corretamente');
        }

        // Tratar a private key
        if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
            privateKey = privateKey.slice(1, -1);
        }

        if (privateKey.includes('\\n')) {
            privateKey = privateKey.replace(/\\n/g, '\n');
        }

        return {
            credential: admin.credential.cert({
                projectId,
                clientEmail,
                privateKey,
            })
        };
    } catch (error: any) {
        console.error('Erro ao configurar Firebase Admin:', error);
        throw new Error(`Não foi possível inicializar o Firebase Admin: ${error.message}`);
    }
}

// Initialize Firebase Admin
if (!admin.apps.length) {
    try {
        admin.initializeApp(getFirebaseAdminConfig());
    } catch (error) {
        console.error('Error initializing Firebase Admin:', error);
        throw error; // Re-throw to prevent app from starting with invalid Firebase config
    }
}

export const auth = admin.auth();
export const db = admin.firestore();
export const storage = admin.storage(); 