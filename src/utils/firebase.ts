import { initializeApp, getApps } from 'firebase/app';
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { getFirestore, collection } from 'firebase/firestore';
import { validateFirebaseConfig } from './firebase-config-validator';

// Log configuration for debugging
const configStatus = validateFirebaseConfig();
console.log('Firebase configuration status:', configStatus);

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCDYcCTzJXapKq-XbScFRXF0tKOyFrRTjQ',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || 'yallah-login.firebaseapp.com',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'yallah-login',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || 'yallah-login.firebasestorage.app',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '957957098970',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '1:957957098970:web:16b2544593b2238f7c4e3'
};

// Verify if any values are undefined and log warning
Object.entries(firebaseConfig).forEach(([key, value]) => {
    if (!value) console.warn(`Firebase config missing: ${key}`);
});

console.log('Using Firebase config:', {
    projectId: firebaseConfig.projectId,
    authDomain: firebaseConfig.authDomain
});

// Initialize Firebase only if no instance exists
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Configure session persistence to expire when browser is closed
setPersistence(auth, browserSessionPersistence).catch((error) => {
    console.error('Error setting auth persistence:', error);
});

// Initialize Firestore
const db = getFirestore(app);

// Collection references
const propertiesCollection = collection(db, 'properties');

export { app, auth, db, propertiesCollection }; 