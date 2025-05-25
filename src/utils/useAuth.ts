import { useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabaseClient';

export function useAuth() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const session = supabase.auth.getSession().then(({ data }) => {
            setUser(data.session?.user ?? null);
            setLoading(false);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setLoading(false);
        });
        return () => {
            listener?.subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setError(null);
        setLoading(true);
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        setUser(data?.user ?? null);
        setError(error?.message ?? null);
        setLoading(false);
        if (error) throw error;
        return data.user;
    };

    const signOut = async () => {
        setLoading(true);
        const { error } = await supabase.auth.signOut();
        setUser(null);
        setLoading(false);
        if (error) throw error;
    };

    // checkCredentials pode ser um alias para signIn
    const checkCredentials = signIn;

    return {
        user,
        error,
        loading,
        signIn,
        signOut,
        checkCredentials
    };
} 