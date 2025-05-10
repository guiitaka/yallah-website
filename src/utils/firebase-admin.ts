import * as admin from 'firebase-admin';

function formatPrivateKey(key: string | undefined): string {
    if (!key) throw new Error('FIREBASE_PRIVATE_KEY is not set in environment variables');
    // Handle both formats: raw private key or already properly formatted
    return key.includes('PRIVATE KEY') ? key.replace(/\\n/g, '\n') : key;
}

function getFirebaseAdminConfig() {
    const privateKey = formatPrivateKey(process.env.FIREBASE_PRIVATE_KEY);
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

    if (!projectId || !clientEmail) {
        throw new Error('FIREBASE_PROJECT_ID and FIREBASE_CLIENT_EMAIL must be set in environment variables');
    }

    return {
        credential: admin.credential.cert({
            projectId,
            clientEmail,
            privateKey,
        }),
        // Add any additional config options here if needed
    };
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