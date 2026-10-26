const baseUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export function getSession() {
    try {
        const session = JSON.parse(localStorage.getItem('auth'));
        return session?.access_token && session?.user?.id ? session : null;
    } catch {
        localStorage.removeItem('auth');
        return null;
    }
}

export function saveSession(session) {
    if (session?.access_token && session?.user?.id) {
        const saved = {
            ...session,
            expires_at: session.expires_at || Math.floor(Date.now() / 1000) + session.expires_in,
        };
        localStorage.setItem('auth', JSON.stringify(saved));
    } else {
        localStorage.removeItem('auth');
    }
    window.dispatchEvent(new Event('auth-change'));
}

export async function authRequest(path, data, token) {
    if (!baseUrl || !apiKey) throw new Error('Supabase configuration is missing.');
    const headers = { apikey: apiKey, 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${baseUrl}/auth/v1${path}`, {
        method: 'POST',
        headers,
        ...(data ? { body: JSON.stringify(data) } : {}),
    });
    return readResponse(response);
}

let refreshPromise;

export async function refreshSession() {
    const session = getSession();
    if (!session) return null;
    if (session.expires_at > Math.floor(Date.now() / 1000) + 30) return session;
    if (!refreshPromise) {
        refreshPromise = authRequest('/token?grant_type=refresh_token', {
            refresh_token: session.refresh_token,
        })
            .then(result => {
                if (getSession()?.refresh_token === session.refresh_token) saveSession(result);
                return getSession();
            })
            .catch(error => {
                if (getSession()?.refresh_token === session.refresh_token) saveSession(null);
                throw error;
            })
            .finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
}

async function readResponse(response) {
    const text = await response.text();
    let data = null;
    if (text) {
        try {
            data = JSON.parse(text);
        } catch {
            throw new Error('The server returned an unexpected response.');
        }
    }
    if (!response.ok) {
        throw new Error(data?.msg || data?.message || data?.error_description || data?.error || 'Request failed. Please try again.');
    }
    return data;
}

export default async function request(path, method = 'GET', data = null, signal) {
    if (!baseUrl || !apiKey) throw new Error('Supabase configuration is missing.');
    const session = await refreshSession();
    const headers = { apikey: apiKey, Prefer: 'return=representation' };
    if (session) headers.Authorization = `Bearer ${session.access_token}`;
    if (data) headers['Content-Type'] = 'application/json';
    const response = await fetch(`${baseUrl}/rest/v1${path}`, {
        method,
        headers,
        signal,
        ...(data ? { body: JSON.stringify(data) } : {}),
    });
    return readResponse(response);
}
