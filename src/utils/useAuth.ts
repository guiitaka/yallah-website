import { useState, useEffect } from 'react';
import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    User
} from 'firebase/auth';
import { auth, db } from './firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Interface para representar um usuário local
interface LocalUser {
    email: string;
    uid: string;
    getIdToken: () => Promise<string>;
}

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        setError(null);
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setUser(userCredential.user);
            return userCredential.user;
        } catch (error: any) {
            setError(error.message);
            throw error;
        }
    };

    const createAdminUser = async (email: string, password: string) => {
        try {
            // Criar um usuário no Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Adicionar dados ao Firestore
            await setDoc(doc(db, "admins", user.uid), {
                email: user.email,
                role: "admin",
                createdAt: new Date()
            });

            return user;
        } catch (error: any) {
            setError(error.message);
            throw error;
        }
    };

    const checkCredentials = async (username: string, password: string) => {
        setError(null);
        try {
            console.log('Username entered:', username);
            console.log('Expected username:', process.env.NEXT_PUBLIC_ADMIN_USERNAME);
            console.log('Password entered:', password);
            console.log('Expected password:', process.env.NEXT_PUBLIC_ADMIN_PASSWORD);

            // Verificar se as credenciais correspondem às variáveis de ambiente
            if (
                username === 'yallah' &&
                password === '123456'
            ) {
                // Criar um email padrão a partir do username
                const email = `${username}@yallah.com.br`;

                // Verificar se o usuário já existe
                try {
                    return await signIn(email, password);
                } catch (error: any) {
                    // Se o usuário não existir, criá-lo
                    if (error.code === 'auth/user-not-found') {
                        return await createAdminUser(email, password);
                    }
                    throw error;
                }
            } else {
                setError('Credenciais inválidas');
                throw new Error('Credenciais inválidas');
            }
        } catch (error: any) {
            setError(error.message);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
        } catch (error: any) {
            setError(error.message);
            throw error;
        }
    };

    return {
        user,
        loading,
        error,
        signIn,
        signOut,
        checkCredentials
    };
}; 