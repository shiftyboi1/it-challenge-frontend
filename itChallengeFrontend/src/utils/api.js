// Simple API helper that attaches Authorization header if token exists.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function getToken() {
	try {
		return localStorage.getItem('token') || null;
	} catch {
		return null;
	}
}

export async function request(path, { method = 'GET', headers = {}, body } = {}) {
	const token = getToken();
	const reqHeaders = { 'Content-Type': 'application/json', ...headers };
	if (token) reqHeaders.Authorization = `Bearer ${token}`;

	const res = await fetch(`${BASE}${path.startsWith('/') ? '' : '/'}${path}`.replace(/\/+/g, '/'), {
		method,
		headers: reqHeaders,
		body: body != null ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined,
	});

	let data = null;
	try {
		data = await res.json();
	} catch {
		// ignore non-JSON
	}

	if (!res.ok) {
		const msg = (data && (data.message || data.error)) || `HTTP ${res.status}`;
		const err = new Error(msg);
		err.status = res.status;
		err.data = data;
		throw err;
	}
	return data;
}

export const api = {
	get: (path) => request(path, { method: 'GET' }),
	post: (path, body) => request(path, { method: 'POST', body }),
	patch: (path, body) => request(path, { method: 'PATCH', body }),
	del: (path) => request(path, { method: 'DELETE' }),
};

export default api;
