import { useState } from 'react';
import { User, signInWithCustomToken, signOut as firebaseSignOut } from 'firebase/auth';
import { auth } from './firebase';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

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

    const checkCredentials = async (username: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: username.includes('@') ? username : `${username}@yallah.com.br`,
                    password,
                }),
            });

            const responseData = await response.json();

            if (!response.ok) {
                throw new Error(responseData.error || 'Credenciais inválidas');
            }

            // Obter o token diretamente da resposta
            const token = responseData.token;

            if (!token) {
                throw new Error('Token de autenticação não encontrado na resposta');
            }

            // Autenticar com Firebase usando o token personalizado
            const { user } = await signInWithCustomToken(auth, token);
            setUser(user);
            setLoading(false);
            return user;
        } catch (error) {
            setLoading(false);
            setError(error instanceof Error ? error.message : 'Falha na autenticação');
            throw error;
        }
    };

    const signOut = async () => {
        try {
            // Logout do Firebase
            await firebaseSignOut(auth);
            setUser(null);

            // Chamar API de logout para limpar sessão no servidor
            await fetch('/api/auth/logout', {
                method: 'POST'
            });

            // Limpar todos os cookies relacionados à sessão no cliente
            document.cookie = 'admin_session=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';

            // Limpar localStorage para garantir
            if (typeof window !== 'undefined') {
                // Limpar todos os itens Firebase do localStorage
                Object.keys(localStorage).forEach(key => {
                    if (key.startsWith('firebase:')) {
                        localStorage.removeItem(key);
                    }
                });

                // Limpar sessionStorage
                sessionStorage.clear();
            }

            console.log('Logout realizado com sucesso');
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return {
        user,
        error,
        loading,
        signIn,
        signOut,
        checkCredentials
    };
} 