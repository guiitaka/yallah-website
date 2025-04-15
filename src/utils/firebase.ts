import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Para debug - verificar se a configuração está sendo carregada corretamente
console.log('Firebase Config carregada:', {
    apiKey: firebaseConfig.apiKey?.substring(0, 5) + '...',
    projectId: firebaseConfig.projectId
});

// Inicializa o Firebase apenas se não houver uma instância
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Configura a persistência de sessão para expirar quando o navegador for fechado
setPersistence(auth, browserSessionPersistence)
    .then(() => {
        console.log('Firebase Auth: Persistência de sessão temporária configurada');
    })
    .catch((error) => {
        console.error('Erro ao configurar persistência:', error);
    });

// Inicializa o Firestore
const db = getFirestore(app);

// Referências de coleções no Firestore
const propertiesCollection = collection(db, 'properties');

export { app, auth, db, propertiesCollection }; 