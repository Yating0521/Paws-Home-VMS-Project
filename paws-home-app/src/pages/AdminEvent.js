import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:5000';

const toYMD = (d) => {
  if (!d) return '';
  const dt = new Date(d);
  if (Number.isNaN(dt.getTime())) return '';
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${dt.getFullYear()}-${m}-${day}`;
};

export default function AdminEvent() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  const [newEvt, setNewEvt] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
  });

  const [editingId, setEditingId] = useState(null);
  const [editEvt, setEditEvt] = useState({
    name: '',
    description: '',
    date: '',
    location: '',
    capacity: '',
  });

  const fetchAll = async () => {
    setLoading(true);
    setErr('');
    try {
      const r = await fetch(`${API_BASE}/api/events`);
      const data = await r.json();
      setEvents(data.map((e) => ({
        ...e,
        date: toYMD(e.date),
        capacity: e.capacity != null ? String(e.capacity) : '',
      })));
    } catch {
      setErr('Failed to load events');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => { fetchAll(); }, []);

  const validate = (e) => {
    if (!e.name.trim()) return 'Name is required';
    if (!e.date) return 'Date is required';
    if (!e.location.trim()) return 'Location is required';
    if (e.capacity === '') return 'Capacity is required';
    const cap = Number(e.capacity);
    if (!Number.isInteger(cap) || cap < 0) return 'Capacity must be a non-negative integer';
    return '';
  };


  const onCreate = async (ev) => {
  ev.preventDefault();
  const msg = validate(newEvt);
  if (msg) { setErr(msg); return; }
  setErr('');
  try {
    const r = await fetch(`${API_BASE}/api/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...newEvt,
        capacity: Number(newEvt.capacity),
      }),
    });
    if (!r.ok) throw new Error();
    await fetchAll();
    setNewEvt({ name: '', description: '', date: '', location: '', capacity: '' }); // 全部清空
  } catch {
    setErr('Failed to add event');
  }
};


  const startEdit = (e) => {
    setEditingId(e.event_id);
    setEditEvt({
      name: e.name ?? '',
      description: e.description ?? '',
      date: toYMD(e.date),
      location: e.location ?? '',
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditEvt({ name: '', description: '', date: '', location: '' });
  };

  const saveEdit = async (id) => {
    const msg = validate(editEvt);
    if (msg) { setErr(msg); return; }
    setErr('');
    try {
      const r = await fetch(`${API_BASE}/api/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...editEvt,
          capacity: Number(editEvt.capacity),
        }),
      });
      if (!r.ok) throw new Error();
      const updated = await r.json();
      setEvents((prev) =>
        prev.map((x) =>
          x.event_id === id ? { ...updated, date: toYMD(updated.date) } : x
        )
      );
      cancelEdit();
    } catch {
      setErr('Failed to save changes');
    }
  };

  const onDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const r = await fetch(`${API_BASE}/api/events/${id}`, { method: 'DELETE' });
      if (!r.ok && r.status !== 204) throw new Error();
      setEvents((prev) => prev.filter((x) => x.event_id !== id));
    } catch {
      setErr('Failed to delete');
    }
  };

  return (
    <div className="admin-page">

      {err && <div className="alert-error">{err}</div>}

      <div className="admin-card">
        <h2 className="card-title">Add New Event</h2>
        <form className="form-row" onSubmit={onCreate}>
          <input
            className="input"
            placeholder="Name"
            value={newEvt.name}
            onChange={(e) => setNewEvt({ ...newEvt, name: e.target.value })}
          />
          <input
            className="input"
            type="date"
            value={newEvt.date}
            onChange={(e) => setNewEvt({ ...newEvt, date: e.target.value })}
          />
          <input
            className="input"
            placeholder="Location"
            value={newEvt.location}
            onChange={(e) => setNewEvt({ ...newEvt, location: e.target.value })}
          />
          <button className="btn btn--primary" type="submit">Add</button>
        </form>
        <textarea
          className="input input--description"
          rows={3}
          placeholder="Description"
          value={newEvt.description}
          onChange={(e) => setNewEvt({ ...newEvt, description: e.target.value })}
          style={{ marginTop: 10, width: '100%' }}
        />
        <input
          className="input"
          type="number"
          min="0"
          placeholder="Capacity"
          value={newEvt.capacity}
          onChange={(e) => setNewEvt({ ...newEvt, capacity: e.target.value })}
        />
      </div>

      <div className="admin-card">
        <h2 className="card-title">Events</h2>
        {loading ? (
          <div className="loading">Loading…</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 30 }}>ID</th>
                  <th style={{ width: 120 }}>Name</th>
                  <th style={{ width: 100 }}>Date</th>
                  <th>Location</th>
                  <th>Description</th>
                  <th style={{ width: 30 }}>Capacity</th>
                  <th style={{ width: 120 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((e) => (
                  <tr key={e.event_id}>
                    <td>{e.event_id}</td>
                    <td>
                      {editingId === e.event_id ? (
                        <input
                          className="input input--small"
                          value={editEvt.name}
                          onChange={(ev) => setEditEvt({ ...editEvt, name: ev.target.value })}
                        />
                      ) : e.name}
                    </td>
                    <td>
                      {editingId === e.event_id ? (
                        <input
                          className="input input--small"
                          type="date"
                          value={editEvt.date}
                          onChange={(ev) => setEditEvt({ ...editEvt, date: ev.target.value })}
                        />
                      ) : toYMD(e.date)}
                    </td>
                    <td>
                      {editingId === e.event_id ? (
                        <input
                          className="input input--small"
                          value={editEvt.location}
                          onChange={(ev) => setEditEvt({ ...editEvt, location: ev.target.value })}
                        />
                      ) : e.location}
                    </td>
                    <td>
                      {editingId === e.event_id ? (
                        <textarea
                          className="input input--small input--textarea"
                          rows={3}
                          value={editEvt.description}
                          onChange={(ev) => setEditEvt({ ...editEvt, description: ev.target.value })}
                        />
                      ) : (e.description || '')}
                    </td>
                     <td>
                      {editingId === e.event_id ? (
                        <input
                          className="input input--small"
                          type="number"
                          min="0"
                          value={editEvt.capacity}
                          onChange={(ev) => setEditEvt({ ...editEvt, capacity: ev.target.value })}
                        />
                      ) : e.capacity}
                    </td>
                    <td className="actions">
                      {editingId === e.event_id ? (
                        <>
                          <button className="btn btn--primary" onClick={() => saveEdit(e.event_id)}>Save</button>
                          <button className="btn btn--ghost" onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button className="btn" onClick={() => startEdit(e)}>Edit</button>
                          <button className="btn btn--danger" onClick={() => onDelete(e.event_id)}>Delete</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr><td colSpan={6} className="empty">No events</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
