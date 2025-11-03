import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => {
		try { return localStorage.getItem('token') || null; } catch { return null; }
	});
	const [user, setUser] = useState(() => {
		try { const raw = localStorage.getItem('user'); return raw ? JSON.parse(raw) : null; } catch { return null; }
	});
	const [loading, setLoading] = useState(false);

	// Keep localStorage in sync
	useEffect(() => {
		try {
			if (token) localStorage.setItem('token', token); else localStorage.removeItem('token');
		} catch {}
	}, [token]);
	useEffect(() => {
		try {
			if (user) localStorage.setItem('user', JSON.stringify(user)); else localStorage.removeItem('user');
		} catch {}
	}, [user]);

	// Optionally validate token on load
	useEffect(() => {
		let ignore = false;
		async function loadMe() {
			if (!token) return;
			setLoading(true);
			try {
				const data = await api.get('/me');
				if (!ignore && data && data.user) setUser(data.user);
			} catch {
				// invalid token
				if (!ignore) {
					setToken(null);
					setUser(null);
				}
			} finally {
				if (!ignore) setLoading(false);
			}
		}
		loadMe();
		return () => { ignore = true; };
	}, []);

	async function login(email, password) {
		const data = await api.post('/auth/login', { email, password });
		if (data && data.token) setToken(data.token);
		if (data && data.user) setUser(data.user);
		return data;
	}

	function logout() {
		setToken(null);
		setUser(null);
	}

	const value = useMemo(() => ({
		token,
		user,
		loading,
		isAuthenticated: !!token,
		role: user?.role || null,
		isAdmin: user?.role === 'ADMIN',
		isManager: user?.role === 'SPRAVCA',
		login,
		logout,
	}), [token, user, loading]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
	return ctx;
}

export default AuthContext;
