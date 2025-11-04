import React, { useEffect, useMemo, useState } from 'react';
import api from '../../utils/api';
import './tables.css';
import { formatPrice } from '../../utils/format';

const STATUS_OPTIONS = [
  { label: 'Všetky', value: '' },
  { label: 'Spracúva sa', value: 'PROCESSING' },
  { label: 'Vybavené', value: 'FULFILLED' },
  { label: 'Zrušené', value: 'CANCELLED' },
];

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');
  const [expanded, setExpanded] = useState(() => new Set());
  const [page, setPage] = useState(1);
  const pageSize = 5;

  async function fetchOrders() {
    setLoading(true);
    setError('');
    try {
      const data = await api.get('/orders');
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (e) {
      setError(e.message || 'Nepodarilo sa načítať objednávky');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchOrders(); }, []);

  useEffect(() => { setPage(1); }, [statusFilter, search]);

  const visible = useMemo(() => {
    let list = [...orders];
    const q = search.trim().toLowerCase();
    if (statusFilter) list = list.filter(o => (o.status || '').toUpperCase() === statusFilter);
    if (q) list = list.filter(o => {
      const name = (o.user?.name || '').toLowerCase();
      const email = (o.user?.email || '').toLowerCase();
      return name.includes(q) || email.includes(q);
    });
    list.sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      let av, bv;
      if (sortBy === 'user') {
        av = (a.user?.name || a.user?.email || '').toLowerCase();
        bv = (b.user?.name || b.user?.email || '').toLowerCase();
      } else if (sortBy === 'email') {
        av = (a.user?.email || '').toLowerCase();
        bv = (b.user?.email || '').toLowerCase();
      } else if (sortBy === 'status') {
        av = (a.status || '').toLowerCase();
        bv = (b.status || '').toLowerCase();
      } else if (sortBy === 'total') {
        av = Number(a.total) || 0;
        bv = Number(b.total) || 0;
      } else {
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
      }
      if (av < bv) return -1 * dir;
      if (av > bv) return 1 * dir;
      return 0;
    });
    return list;
  }, [orders, statusFilter, search, sortBy, sortDir]);

  const totalPages = Math.max(1, Math.ceil(visible.length / pageSize));
  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return visible.slice(start, end);
  }, [visible, page]);

  function toggleSort(column) {
    if (sortBy === column) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortBy(column); setSortDir('asc'); }
  }
  function setSort(column, dir) { setSortBy(column); setSortDir(dir); }

  function toggleExpand(id) {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }

  async function updateStatus(order, nextStatus) {
    try {
      setLoading(true);
      await api.patch(`/orders/${order.id}/status`, { status: nextStatus });
      await fetchOrders();
    } catch (e) {
      alert(e.message || 'Zmena statusu zlyhala');
    } finally {
      setLoading(false);
    }
  }

  async function deleteOrder(order) {
    if (!window.confirm(`Naozaj chceš zmazať objednávku #${order.id}?`)) return;
    try {
      setLoading(true);
      await api.del(`/orders/${order.id}`);
      await fetchOrders();
    } catch (e) {
      alert(e.message || 'Mazanie objednávky zlyhalo');
    } finally {
      setLoading(false);
    }
  }

  async function deleteItem(orderId, itemId) {
    if (!window.confirm('Zmazať položku z objednávky?')) return;
    try {
      setLoading(true);
      const res = await api.del(`/orders/${orderId}/items/${itemId}`);
      if (res?.deletedOrder) {
        await fetchOrders();
      } else {
        setOrders(prev => prev.map(o => {
          if (o.id !== orderId) return o;
          const items = (o.items || []).filter(it => it.id !== itemId);
          const total = items.reduce((sum, it) => sum + (Number(it.price) * Number(it.quantity)), 0);
          return { ...o, items, total };
        }));
      }
    } catch (e) {
      alert(e.message || 'Mazanie položky zlyhalo');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="orders-admin">
      <div className="users-toolbar card-surface">
        <div className="filters">
          <div className="segmented" role="tablist" aria-label="Filter statusu">
            {STATUS_OPTIONS.map(opt => (
              <button
                key={opt.value || 'ALL'}
                role="tab"
                className={`chip ${statusFilter === opt.value ? 'active' : ''}`}
                aria-selected={statusFilter === opt.value}
                type="button"
                onClick={() => setStatusFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div className="search">
            <input
              type="search"
              className="input"
              placeholder="Hľadať meno alebo email zákazníka"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="status">
          {loading && <span className="muted">Načítavam…</span>}
          {error && <span className="error">{error}</span>}
        </div>
      </div>

      <div className="table-wrap card-surface">
        <table className="nice-table">
          <thead>
            <tr>
              <th className="sortable">
                <span className="th-label" onClick={() => toggleSort('user')}>Zákazník</span>
                <span className="sort-arrows">
                  <button type="button" className={`sort-btn ${sortBy==='user' && sortDir==='asc' ? 'active' : ''}`} aria-label="Zoradiť A→Z" onClick={() => setSort('user','asc')}>▲</button>
                  <button type="button" className={`sort-btn ${sortBy==='user' && sortDir==='desc' ? 'active' : ''}`} aria-label="Zoradiť Z→A" onClick={() => setSort('user','desc')}>▼</button>
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
                <span className="th-label" onClick={() => toggleSort('status')}>Status</span>
                <span className="sort-arrows">
                  <button type="button" className={`sort-btn ${sortBy==='status' && sortDir==='asc' ? 'active' : ''}`} aria-label="Zoradiť A→Z" onClick={() => setSort('status','asc')}>▲</button>
                  <button type="button" className={`sort-btn ${sortBy==='status' && sortDir==='desc' ? 'active' : ''}`} aria-label="Zoradiť Z→A" onClick={() => setSort('status','desc')}>▼</button>
                </span>
              </th>
              <th className="sortable">
                <span className="th-label" onClick={() => toggleSort('total')}>Spolu</span>
                <span className="sort-arrows">
                  <button type="button" className={`sort-btn ${sortBy==='total' && sortDir==='asc' ? 'active' : ''}`} aria-label="Zoradiť ↑" onClick={() => setSort('total','asc')}>▲</button>
                  <button type="button" className={`sort-btn ${sortBy==='total' && sortDir==='desc' ? 'active' : ''}`} aria-label="Zoradiť ↓" onClick={() => setSort('total','desc')}>▼</button>
                </span>
              </th>
              <th className="sortable">
                <span className="th-label" onClick={() => toggleSort('createdAt')}>Vytvorené</span>
                <span className="sort-arrows">
                  <button type="button" className={`sort-btn ${sortBy==='createdAt' && sortDir==='asc' ? 'active' : ''}`} aria-label="Zoradiť ↑" onClick={() => setSort('createdAt','asc')}>▲</button>
                  <button type="button" className={`sort-btn ${sortBy==='createdAt' && sortDir==='desc' ? 'active' : ''}`} aria-label="Zoradiť ↓" onClick={() => setSort('createdAt','desc')}>▼</button>
                </span>
              </th>
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
            {visible.length === 0 && (
              <tr>
                <td colSpan={6} className="muted">Žiadne objednávky</td>
              </tr>
            )}
            {pageItems.map((o) => {
              const isOpen = expanded.has(o.id);
              return (
                <React.Fragment key={o.id}>
                  <tr>
                    <td>
                      <div className="user-cell">
                        <div className="avatar" aria-hidden>
                          {(o.user?.name || o.user?.email || '?').slice(0,2).toUpperCase()}
                        </div>
                        <div className="user-meta">
                          <div className="name">{o.user?.name || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td><span className="mono">{o.user?.email}</span></td>
                    <td>
                      <select
                        className="input"
                        value={o.status}
                        onChange={e => updateStatus(o, e.target.value)}
                      >
                        <option value="PROCESSING">PROCESSING</option>
                        <option value="FULFILLED">FULFILLED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                    <td>{formatPrice(o.total || 0)}</td>
                    <td>{new Date(o.createdAt).toLocaleString()}</td>
                    <td className="actions">
                      <button className="btn" type="button" onClick={() => toggleExpand(o.id)}>{isOpen ? 'Skryť položky' : 'Zobraziť položky'}</button>
                      <button className="btn danger" type="button" onClick={() => deleteOrder(o)}>Zmazať objednávku</button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr>
                      <td colSpan={6}>
                        {(o.items || []).length === 0 ? (
                          <div className="muted">Žiadne položky</div>
                        ) : (
                          <div style={{ display: 'grid', gap: 8 }}>
                            {o.items.map(it => (
                              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px dashed var(--line)', paddingTop: 8 }}>
                                <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                  <div className="user-meta">
                                    <div className="name">{it.product?.name || it.productId}</div>
                                    <div className="sub">Množstvo: {it.quantity} × {formatPrice(it.price || 0)}</div>
                                  </div>
                                </div>
                                <div className="actions">
                                  <button className="btn ghost" type="button" onClick={() => deleteItem(o.id, it.id)}>Zmazať položku</button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button className="btn" type="button" disabled={page <= 1} onClick={() => setPage(p => Math.max(1, p - 1))}>Predošlá</button>
        <span>
          Strana {page} / {totalPages}
        </span>
        <button className="btn" type="button" disabled={page >= totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))}>Ďalšia</button>
      </div>
    </div>
  );
}
