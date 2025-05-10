import { useState } from 'react';
import { User, signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    const signIn = async (username: string, password: string) => {
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: `${username}@yallah.com.br`,
                    password,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Authentication failed');
            }

            // After successful server authentication, sign in to Firebase
            const { user } = await signInWithCustomToken(
                auth,
                document.cookie
                    .split('; ')
                    .find(row => row.startsWith('admin_session='))
                    ?.split('=')[1] || ''
            );

            setUser(user);
            return user;
        } catch (error) {
            setError(error instanceof Error ? error.message : 'Authentication failed');
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            // Clear the session cookie
            document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return {
        user,
        error,
        signIn,
        signOut,
    };
} 