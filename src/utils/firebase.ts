import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCDYcCTzJXapKq-XbScFRXF0tKOyFrRTjQ",
    authDomain: "yallah-admin.firebaseapp.com",
    projectId: "yallah-admin",
    storageBucket: "yallah-admin.appspot.com",
    messagingSenderId: "969314011610",
    appId: "1:969314011610:web:2bf93b97a7fd56b49398e3"
};

// Para debug - verificar se a configuração está sendo carregada corretamente
console.log('Firebase Config carregada:', {
    apiKey: firebaseConfig.apiKey.substring(0, 5) + '...',
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

const db = getFirestore(app);

export { app, auth, db }; 