// src/pages/AdminVolunteer.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../App.css';

const API_BASE = 'http://localhost:5000';

export default function AdminVolunteer() {
  // ---- Volunteers CRUD ----
  const [vols, setVols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  // const [newVol, setNewVol] = useState({ name: '', email: '' });
  const [searchId, setSearchId] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editVol, setEditVol] = useState({ name: '', email: '' });

  // ---- Messaging ----
  const [messagingId, setMessagingId] = useState(null);
  const [messagingName, setMessagingName] = useState('');
  const [msgForm, setMsgForm] = useState({
    title: '',
    sender_name: 'Volunteer Admin Team',
    // date: new Date().toISOString().slice(0, 10), // yyyy-mm-dd
    date: '',
    content: '',
  });

  // ===== Fetch all volunteers =====
  const fetchAll = async () => {
    setLoading(true);
    setErr('');
    try {
      const r = await fetch(`${API_BASE}/api/volunteers`);
      const data = await r.json();
      setVols(data);
    } catch (e) {
      setErr('Failed, please try again later');
    } finally {
      setLoading(false);
    }
  };

  const updateVolunteer = (volunteerId, updatedFields) => {
    setVols((prev) =>
      prev.map((vol) =>
        vol.volunteer_id === volunteerId ? { ...vol, ...updatedFields } : vol
      )
    );
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ===== Create =====
  // const onCreate = async (e) => {
  //   e.preventDefault();
  //   setErr('');
  //   if (!newVol.name.trim() || !newVol.email.trim()) {
  //     setErr('Name and Email is required');
  //     return;
  //   }
  //   try {
  //     const r = await fetch(`${API_BASE}/api/volunteers`, {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(newVol),
  //     });
  //     if (!r.ok) throw new Error();
  //     const created = await r.json();
  //     setVols((prev) => [...prev, created]);
  //     setNewVol({ name: '', email: '' });
  //   } catch {
  //     setErr('Failed to add volunteer');
  //   }
  // };

  // ===== Search volunteer by ID =====
  const onSearch = async (e) => {
    e.preventDefault();
    setErr('');
    if (!searchId.trim()) {
      setErr('Please enter a Volunteer ID');
      return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${API_BASE}/api/volunteers/${searchId.trim()}`);
      if (!r.ok) {
        if (r.status === 404) setErr('Volunteer not found');
        else throw new Error();
        setVols([]);
        return;
      }
      const vol = await r.json();
      setVols([vol]); // Set single volunteer as result
    } catch {
      setErr('Failed to fetch volunteer');
      setVols([]);
    } finally {
      setLoading(false);
    }
  };


  // ===== Edit / Update =====
  const startEdit = (v) => {
    setEditingId(v.volunteer_id);
    setEditVol({ name: v.name, email: v.email });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditVol({ name: '', email: '' });
  };

  // Save edited volunteer
  const saveEdit = async (userId, volunteerId) => {
    try {
      const res = await fetch(`${API_BASE}/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editVol),
      });
      if (!res.ok) throw new Error('Failed to update');

      const updatedUser = await res.json();

      updateVolunteer(volunteerId, updatedUser);

      setEditingId(null);

      fetchAll();
  
    } catch (err) {
      console.error(err);
    }
  };
  // const saveEdit = async (id) => {
  //   setErr('');
  //   if (!editVol.name.trim() || !editVol.email.trim()) {
  //     setErr('Name and Email is required');
  //     return;
  //   }
  //   try {
  //     const r = await fetch(`${API_BASE}/api/users/${id}`, {
  //       method: 'PUT',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(editVol),
  //     });
  //     if (!r.ok) throw new Error();
  //     const updated = await r.json();
  //     setVols((prev) => prev.map((x) => (x.user_id === id ? updated : x)));
  //     cancelEdit();
  //   } catch {
  //     setErr('Fail to Edit');
  //   }
  // };


  // ===== Delete =====
  const onDelete = async (id) => {
    if (!window.confirm('Delete this volunteer for sure?')) return;
    try {
      const r = await fetch(`${API_BASE}/api/volunteers/${id}`, { method: 'DELETE' });
      if (!r.ok && r.status !== 204) throw new Error();
      setVols((prev) => prev.filter((x) => x.volunteer_id !== id));
    } catch {
      setErr('Fail to Delete');
    }
  };

  // ===== Messaging: open / cancel / send =====
  const openMessage = (v) => {
    setMessagingId(v.volunteer_id);
    setMessagingName(v.name);
    setMsgForm({
      title: '',
      sender_name: 'Volunteer Admin Team',
      date: new Date().toISOString().slice(0, 10),
      content: '',
    });
  };

  const cancelMessage = () => {
    setMessagingId(null);
    setMessagingName('');
  };

  const sendMessage = async () => {
    if (!messagingId) return;

    const payload = {
      ...msgForm,
      recipient_ids: [messagingId]
    };

    try {
      const res = await fetch('http://localhost:5000/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      alert('Message sent successfully, id: ' + data.message_id);

      setMsgForm({ title: '', sender_name: '', date: '', content: '' });
      setMessagingId(null);
      setMessagingName('');
    } catch (error) {
      alert('Error sending message: ' + error.message);
    }
  };

  // ===== Render =====
  return (
    <div className="admin-page">

      {err && <div className="alert-error">{err}</div>}

      {/* Add Volunteer */}
      {/* <div className="admin-card">
        <h2 className="card-title">Add New Volunteer</h2>
        <form onSubmit={onCreate} className="form-row">
          <input
            className="input"
            placeholder="Name"
            value={newVol.name}
            onChange={(e) => setNewVol({ ...newVol, name: e.target.value })}
          />
          <input
            className="input"
            placeholder="Email"
            value={newVol.email}
            onChange={(e) => setNewVol({ ...newVol, email: e.target.value })}
          />
          <button type="submit" className="btn btn--primary">Add</button>
        </form>
      </div> */}

      {/* Search Volunteer by ID */}
      <div className="admin-card">
        <h2 className="card-title">Search Volunteer by ID</h2>
        <form onSubmit={onSearch} className="form-row" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <input
            className="input"
            placeholder="Volunteer ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ flexGrow: 1 }}
          />
          <button type="submit" className="btn btn--primary">Search</button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={fetchAll}
          >
            Display All
          </button>
        </form>
      </div>

      {/* Compose Message (only visible when clicking "Message") */}
      {messagingId && (
        <div className="admin-card">
          <h2 className="card-title">Send Message to: {messagingName}</h2>
          <div className="form-row">
            <input
              className="input"
              placeholder="Title"
              value={msgForm.title}
              onChange={(e) => setMsgForm({ ...msgForm, title: e.target.value })}
            />
            <input
              className="input"
              placeholder="Sender"
              value={msgForm.sender_name}
              onChange={(e) => setMsgForm({ ...msgForm, sender_name: e.target.value })}
            />
            <input
              className="input"
              type="date"
              value={msgForm.date}
              onChange={(e) => setMsgForm({ ...msgForm, date: e.target.value })}
            />
          </div>
          <textarea
            className="input"
            rows={4}
            placeholder="Content"
            value={msgForm.content}
            onChange={(e) => setMsgForm({ ...msgForm, content: e.target.value })}
            style={{ width: '100%', marginTop: 10 }}
          />
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button type="button" className="btn btn--primary" onClick={sendMessage}>Send</button>
            <button type="button" className="btn btn--ghost" onClick={cancelMessage}>Cancel</button>
          </div>
        </div>
      )}

      {/* Volunteers Table */}
      <div className="admin-card">
        <h2 className="card-title">Volunteers</h2>

        {loading ? (
          <div className="loading">Loading…</div>
        ) : (
          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: 100 }}>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th style={{ width: 270 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vols.map((v) => (
                  <tr key={v.volunteer_id}>
                    <td>{v.volunteer_id}</td>
                    <td>
                      {editingId === v.volunteer_id ? (
                        <input
                          className="input input--small"
                          value={editVol.name}
                          onChange={(e) => setEditVol({ ...editVol, name: e.target.value })}
                        />
                      ) : (
                        v.name
                      )}
                    </td>
                    <td>
                      {editingId === v.volunteer_id ? (
                        <input
                          className="input input--small"
                          value={editVol.email}
                          onChange={(e) => setEditVol({ ...editVol, email: e.target.value })}
                        />
                      ) : (
                        v.email
                      )}
                    </td>
                    <td className="actions">
                      {editingId === v.volunteer_id ? (
                        <>
                          <button type="button" className="btn btn--primary" onClick={() => saveEdit(v.volunteer_id)}>Save</button>
                          <button type="button" className="btn btn--ghost" onClick={cancelEdit}>Cancel</button>
                        </>
                      ) : (
                        <>
                          <button type="button" className="btn" onClick={() => startEdit(v)}>Edit</button>
                          <button type="button" className="btn btn--danger" onClick={() => onDelete(v.volunteer_id)}>Delete</button>
                          <button type="button" className="btn btn--primary" onClick={() => openMessage(v)}>Message</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {vols.length === 0 && (
                  <tr>
                    <td colSpan={4} className="empty">No data</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
