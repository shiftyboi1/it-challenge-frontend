import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
	// In-memory auth only; do not restore persisted auth across reloads
	const [token, setToken] = useState(null);
	const [user, setUser] = useState(null);
	// Store the session's current password in-memory only (never persisted)
	const [currentPassword, setCurrentPassword] = useState("");
	const [loading, setLoading] = useState(false);

	// Keep localStorage in sync for same-session API usage
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

	// Ensure any previous persisted auth is cleared on fresh load (force logout on refresh)
	useEffect(() => {
		try {
			localStorage.removeItem('token');
			localStorage.removeItem('user');
			// clear any in-memory password
			setCurrentPassword("");
		} catch {}
	}, []);

	// Optionally validate token on load
    // No /me endpoint available; skip validation to avoid auto-logout

	async function login(email, password) {
		const data = await api.post('/auth/login', { email, password });
		if (data && data.token) setToken(data.token);
		if (data && data.user) setUser(data.user);
		// Track the session's used password (in-memory only)
		setCurrentPassword(password || "");
		return data;
	}

	async function register(name, email, password) {
		const data = await api.post('/auth/register', { name, email, password });
		if (data && data.token) setToken(data.token);
		if (data && data.user) setUser(data.user);
		setCurrentPassword(password || "");
		return data;
	}

	function logout() {
		setToken(null);
		setUser(null);
		setCurrentPassword("");
	}

	const value = useMemo(() => ({
		token,
		user,
		currentPassword,
		loading,
		isAuthenticated: !!token,
		role: user?.role || null,
		isAdmin: user?.role === 'ADMIN',
		isManager: user?.role === 'SPRAVCA',
		login,
		register,
		logout,
	}), [token, user, currentPassword, loading]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
	return ctx;
}

export default AuthContext;
