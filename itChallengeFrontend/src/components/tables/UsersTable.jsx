import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';
import './tables.css';

const ROLE_OPTIONS = [
	{ label: 'Všetci', value: '' },
	{ label: 'Admini', value: 'ADMIN' },
	{ label: 'Manažéri', value: 'SPRAVCA' },
	{ label: 'Užívatelia', value: 'USER' },
];

export default function UsersTable() {
	const auth = useAuth();
	const [users, setUsers] = useState([]);
	const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, pageSize: 20 });
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const [roleFilter, setRoleFilter] = useState('');
	const [search, setSearch] = useState('');
	const [sortBy, setSortBy] = useState('createdAt');
	const [sortDir, setSortDir] = useState('desc');

	const [editingId, setEditingId] = useState(null);
	const [editForm, setEditForm] = useState({ name: '', email: '', role: '' });

			const [showAdd, setShowAdd] = useState(false);
			const [addForm, setAddForm] = useState({ name: '', email: '', password: '', role: 'USER' });
			const [addError, setAddError] = useState('');
			const [addLoading, setAddLoading] = useState(false);

	const page = pagination.page || 1;

	async function fetchUsers(nextPage = page, currentRole = roleFilter, currentSearch = search) {
		setLoading(true);
		setError('');
		try {
			const params = new URLSearchParams();
			params.set('page', String(nextPage));
			if (currentRole) params.set('role', currentRole);
			if (currentSearch) params.set('email', currentSearch);

			const data = await api.get(`/users?${params.toString()}`);
			setUsers(data.users || []);
			setPagination(data.pagination || { page: nextPage, totalPages: 1, total: 0, pageSize: 20 });
		} catch (err) {
			setError(err.message || 'Nepodarilo sa načítať používateľov');
		} finally {
			setLoading(false);
		}
	}

	useEffect(() => {
		fetchUsers(1, roleFilter, search);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [roleFilter]);

	const visibleUsers = useMemo(() => {
		let list = [...users];
		const q = search.trim().toLowerCase();
		if (q) {
			list = list.filter(u => (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q));
		}
		list.sort((a, b) => {
			const dir = sortDir === 'asc' ? 1 : -1;
			let av, bv;
			if (sortBy === 'name') {
				av = (a.name || '').toLowerCase();
				bv = (b.name || '').toLowerCase();
			} else if (sortBy === 'email') {
				av = (a.email || '').toLowerCase();
				bv = (b.email || '').toLowerCase();
			} else if (sortBy === 'role') {
				av = (a.role || '').toLowerCase();
				bv = (b.role || '').toLowerCase();
			} else {
				av = new Date(a.createdAt).getTime();
				bv = new Date(b.createdAt).getTime();
			}
			if (av < bv) return -1 * dir;
			if (av > bv) return 1 * dir;
			return 0;
		});
		return list;
	}, [users, search, sortBy, sortDir]);

	function toggleSort(column) {
		if (sortBy === column) {
			setSortDir(prev => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortBy(column);
			setSortDir('asc');
		}
	}

	function setSort(column, dir) {
		setSortBy(column);
		setSortDir(dir);
	}

	function clearSort(column) {
		if (sortBy === column) {
			setSortBy('createdAt');
			setSortDir('desc');
		}
	}

	function beginEdit(u) {
		setEditingId(u.id);
		setEditForm({ name: u.name || '', email: u.email || '', role: u.role || 'USER' });
	}
	function cancelEdit() {
		setEditingId(null);
		setEditForm({ name: '', email: '', role: '' });
	}

	async function saveEdit(u) {
		try {
			setLoading(true);
			if (editForm.name !== u.name || editForm.email !== u.email) {
				await api.patch(`/users/${u.id}`, { name: editForm.name, email: editForm.email });
			}
			if (u.role !== 'ADMIN' && editForm.role !== u.role) {
				await api.patch(`/users/${u.id}/role`, { role: editForm.role });
			}
			cancelEdit();
			await fetchUsers(page, roleFilter, search);
		} catch (err) {
			setError(err.message || 'Uloženie zlyhalo');
		} finally {
			setLoading(false);
		}
	}

	async function resetPassword(u) {
		const pwd = window.prompt(`Zadaj nové heslo pre ${u.email} (min 8 znakov):`);
		if (!pwd) return;
		if (pwd.length < 8) {
			alert('Heslo musí mať aspoň 8 znakov.');
			return;
		}
		try {
			setLoading(true);
			await api.patch(`/users/${u.id}/password`, { password: pwd });
			alert('Heslo bolo resetované.');
		} catch (err) {
			alert(err.message || 'Reset hesla zlyhal');
		} finally {
			setLoading(false);
		}
	}

	async function deleteUser(u) {
		if (!window.confirm(`Naozaj chceš zmazať používateľa ${u.email}?`)) return;
		try {
			setLoading(true);
			await api.del(`/users/${u.id}`);
			await fetchUsers(page, roleFilter, search);
		} catch (err) {
			alert(err.message || 'Mazanie zlyhalo');
		} finally {
			setLoading(false);
		}
	}

	async function addUser() {
		setAddError('');
		if (!addForm.email || !addForm.password || addForm.password.length < 8) {
			setAddError('Vyplň email a heslo (min 8 znakov).');
			return;
		}
		try {
			setAddLoading(true);
			const created = await api.post('/users', { name: addForm.name, email: addForm.email, password: addForm.password });
			let newUser = created;
			if (addForm.role && addForm.role !== 'USER') {
				const upd = await api.patch(`/users/${created.id}/role`, { role: addForm.role });
				newUser = { ...created, role: upd?.role || addForm.role };
			}
			setUsers(prev => [{ ...newUser }, ...prev]);
			setPagination(p => ({ ...p, total: (p.total || 0) + 1 }));
			setAddForm({ name: '', email: '', password: '', role: 'USER' });
			setShowAdd(false);
			fetchUsers(1, roleFilter, search);
		} catch (err) {
			setAddError(err.message || 'Vytvorenie používateľa zlyhalo');
		} finally {
			setAddLoading(false);
		}
	}

	return (
			<div className="users-admin">
								<div className="users-toolbar card-surface">
					<div className="filters">
						<div className="segmented" role="tablist" aria-label="Filter roly">
							{ROLE_OPTIONS.map(opt => (
												<button
									key={opt.value || 'ALL'}
									role="tab"
									className={`chip ${roleFilter === opt.value ? 'active' : ''}`}
									aria-selected={roleFilter === opt.value}
													type="button"
									onClick={() => { setRoleFilter(opt.value); fetchUsers(1, opt.value, search); }}
								>
									{opt.label}
								</button>
							))}
						</div>
						<div className="search">
							<input
								type="search"
								className="input"
								placeholder="Hľadať meno alebo email"
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								onKeyDown={(e) => { if (e.key === 'Enter') fetchUsers(1, roleFilter, e.currentTarget.value); }}
							/>
						</div>
					</div>
							<div className="status">
						{loading && <span className="muted">Načítavam…</span>}
						{error && <span className="error">{error}</span>}
					</div>
									<div className="actions-right">
										  <button className="btn primary" type="button" onClick={() => { setShowAdd(s => !s); setAddError(''); }}>{showAdd ? 'Zavrieť' : 'Pridať používateľa'}</button>
							</div>
				</div>

				<div className="table-wrap card-surface">
					<table className="nice-table">
					<thead>
						<tr>
								<th className="sortable">
									<span className="th-label" onClick={() => toggleSort('name')}>Meno</span>
									<span className="sort-arrows">
										<button type="button" className={`sort-btn ${sortBy==='name' && sortDir==='asc' ? 'active' : ''}`} aria-label="Zoradiť A→Z" onClick={() => setSort('name','asc')}>▲</button>
										<button type="button" className={`sort-btn ${sortBy==='name' && sortDir==='desc' ? 'active' : ''}`} aria-label="Zoradiť Z→A" onClick={() => setSort('name','desc')}>▼</button>
									</span>
								</th>
							<th className="sortable">
								<span className="th-label" onClick={() => toggleSort('email')}>Email</span>
								<span className="sort-arrows">
									<button type="button" className={`sort-btn ${sortBy==='email' && sortDir==='asc' ? 'active' : ''}`} aria-label="Zoradiť A→Z" onClick={() => setSort('email','asc')}>▲</button>
									<button type="button" className={`sort-btn ${sortBy==='email' && sortDir==='desc' ? 'active' : ''}`} aria-label="Zoradiť Z→A" onClick={() => setSort('email','desc')}>▼</button>
								</span>
							</th>
							<th className="sortable">
								<span className="th-label" onClick={() => toggleSort('role')}>Rola</span>
								<span className="sort-arrows">
									<button type="button" className={`sort-btn ${sortBy==='role' && sortDir==='asc' ? 'active' : ''}`} aria-label="Zoradiť A→Z" onClick={() => setSort('role','asc')}>▲</button>
									<button type="button" className={`sort-btn ${sortBy==='role' && sortDir==='desc' ? 'active' : ''}`} aria-label="Zoradiť Z→A" onClick={() => setSort('role','desc')}>▼</button>
								</span>
							</th>
							<th>Heslo</th>
							<th>
								<div className="header-end-wrap">
									<span>Akcie</span>
									<button
										type="button"
										className="sort-clear-row"
										title="Zrušiť zoradenie"
										aria-label="Zrušiť zoradenie"
										onClick={() => { setSortBy('createdAt'); setSortDir('desc'); }}
									>
										×
									</button>
								</div>
							</th>
						</tr>
					</thead>
					<tbody>
									{showAdd && (
														<tr className="add-row" onKeyDown={(e) => {
															if (e.key === 'Enter') addUser();
															if (e.key === 'Escape') { setShowAdd(false); setAddForm({ name: '', email: '', password: '', role: 'USER' }); setAddError(''); }
														}}>
											<td>
												<input
													className="input"
													placeholder="Meno (voliteľné)"
													value={addForm.name}
													onChange={e => setAddForm(f => ({ ...f, name: e.target.value }))}
												/>
											</td>
											<td>
												<input
													className="input"
													placeholder="Email"
													value={addForm.email}
													onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))}
												/>
											</td>
											<td>
												<select
													className="input"
													value={addForm.role}
													onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))}
												>
													<option value="USER">USER</option>
													<option value="SPRAVCA">SPRAVCA</option>
												</select>
											</td>
											<td>
												<input
													className="input"
													type="password"
													placeholder="Heslo (min 8 znakov)"
													value={addForm.password}
													onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))}
												/>
											</td>
											<td className="actions">
												  <button className="btn" type="button" onClick={() => { setShowAdd(false); setAddForm({ name: '', email: '', password: '', role: 'USER' }); setAddError(''); }}>Zrušiť</button>
												  <button className="btn primary" type="button" disabled={addLoading || !addForm.email || !addForm.password || addForm.password.length < 8} onClick={addUser}>{addLoading ? 'Ukladám…' : 'Vytvoriť'}</button>
												{addError && <span className="error" style={{ marginLeft: 8 }}>{addError}</span>}
											</td>
										</tr>
									)}
						{visibleUsers.length === 0 && (
							<tr>
								<td colSpan={5} className="muted">Žiadni používatelia</td>
							</tr>
						)}
						{visibleUsers.map((u) => {
							const isEditing = editingId === u.id;
							return (
								<tr key={u.id}>
										<td>
											{isEditing ? (
												<input className="input" value={editForm.name} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
											) : (
																		<div className="user-cell">
																			<div className="avatar" aria-hidden>
																				{getInitials(u.name || u.email)}
																			</div>
																			<div className="user-meta">
																				<div className="name">{u.name || '—'}</div>
																			</div>
																		</div>
											)}
									</td>
									<td>
											{isEditing ? (
												<input className="input" value={editForm.email} onChange={(e) => setEditForm(f => ({ ...f, email: e.target.value }))} />
											) : (
												<span className="mono">{u.email}</span>
											)}
									</td>
									<td>
										{isEditing && u.role !== 'ADMIN' ? (
												<select className="input" value={editForm.role} onChange={(e) => setEditForm(f => ({ ...f, role: e.target.value }))}>
												<option value="USER">USER</option>
												<option value="SPRAVCA">SPRAVCA</option>
											</select>
										) : (
												<span className={`badge role-${(u.role || '').toLowerCase()}`}>{u.role}</span>
										)}
									</td>
									<td title="Z bezpečnostných dôvodov sa heslá nezobrazujú">••••••••</td>
										<td className="actions">
															{!isEditing ? (
											<>
																			<button className="btn" type="button" onClick={() => beginEdit(u)}>Editovať</button>
																			{u.role !== 'ADMIN' && <button className="btn danger" type="button" onClick={() => deleteUser(u)}>Zmazať</button>}
																	{/* Allow reset for all except other admins (backend blocks it) */}
																	{!(u.role === 'ADMIN' && auth?.user?.id !== u.id) && (
																				<button className="btn ghost" type="button" onClick={() => resetPassword(u)}>Reset hesla</button>
																	)}
											</>
										) : (
											<>
													<button className="btn primary" type="button" onClick={() => saveEdit(u)}>Uložiť</button>
													<button className="btn" type="button" onClick={cancelEdit}>Zrušiť</button>
											</>
										)}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>

			<div className="pagination">
				<button className="btn" type="button" disabled={page <= 1} onClick={() => fetchUsers(page - 1, roleFilter, search)}>Predošlá</button>
				<span>
					Strana {page} / {pagination.totalPages || 1}
				</span>
				<button className="btn" type="button" disabled={page >= (pagination.totalPages || 1)} onClick={() => fetchUsers(page + 1, roleFilter, search)}>Ďalšia</button>
			</div>

			<p className="muted" style={{ marginTop: 8 }}>
				Poznámka: Heslá nie je možné zobraziť. Admin môže heslo resetovať pre vybraného používateľa.
			</p>
		</div>
	);
}

	// Helpers
	function getInitials(nameOrEmail) {
		const s = (nameOrEmail || '').trim();
		if (!s) return '?';
		const parts = s.includes('@') ? s.split('@')[0].split(/[._-]/) : s.split(' ');
		const letters = parts.filter(Boolean).slice(0, 2).map(p => p[0].toUpperCase());
		return letters.join('') || s[0].toUpperCase();
	}
