import { createContext, useEffect, useState } from 'react';
import * as authApi from '../api/auth-api';
import { getSession, refreshSession, saveSession } from '../utils/request';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [auth, setAuth] = useState(getSession);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let active = true;
        const update = () => setAuth(getSession());
        const refresh = () => refreshSession().catch(() => {}).finally(() => {
            if (active) setLoading(false);
        });
        window.addEventListener('auth-change', update);
        window.addEventListener('storage', update);
        window.addEventListener('focus', refresh);
        refresh();
        const timer = window.setInterval(refresh, 30000);
        return () => {
            active = false;
            window.clearInterval(timer);
            window.removeEventListener('auth-change', update);
            window.removeEventListener('storage', update);
            window.removeEventListener('focus', refresh);
        };
    }, []);

    async function login(data) {
        const result = await authApi.login(data);
        saveSession(result);
    }

    async function register(data) {
        const result = await authApi.register(data);
        if (result.access_token) saveSession(result);
        return Boolean(result.access_token);
    }

    async function logout() {
        try {
            const session = await refreshSession();
            if (session) await authApi.logout(session.access_token);
        } finally {
            saveSession(null);
        }
    }

    return (
        <AuthContext.Provider value={{ user: auth?.user, isAuthenticated: Boolean(auth), loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;
