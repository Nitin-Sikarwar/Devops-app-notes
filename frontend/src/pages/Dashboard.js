import React, { useState, useEffect, useCallback } from 'react';
import { notesAPI } from '../services/api';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import ConfirmDialog from '../components/ConfirmDialog';

export default function Dashboard() {
  const [notes, setNotes] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [deleteNote, setDeleteNote] = useState(null);
  const [error, setError] = useState('');

  const fetchNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await notesAPI.getAll({ search, page, limit: 9 });
      setNotes(data.notes);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      setError('Failed to load notes. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [search, page]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  // Debounce search
  useEffect(() => { setPage(1); }, [search]);

  const handleSave = async (form) => {
    setSaving(true);
    try {
      if (editNote) {
        await notesAPI.update(editNote.id, form);
      } else {
        await notesAPI.create(form);
      }
      setShowModal(false);
      setEditNote(null);
      fetchNotes();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await notesAPI.delete(deleteNote.id);
      setDeleteNote(null);
      fetchNotes();
    } catch {
      setError('Failed to delete note');
    } finally {
      setDeleting(false);
    }
  };

  const openCreate = () => { setEditNote(null); setShowModal(true); };
  const openEdit = (note) => { setEditNote(note); setShowModal(true); };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Notes</h1>
          <p className="dashboard-stats">{total} note{total !== 1 ? 's' : ''} total</p>
        </div>
        <button className="btn btn-primary" onClick={openCreate}>+ New Note</button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <div className="notes-toolbar">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search notes by title, content, or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="spinner-wrap"><div className="spinner" /></div>
      ) : notes.length === 0 ? (
        <div className="notes-empty">
          <h3>{search ? 'No notes found' : 'No notes yet'}</h3>
          <p>{search ? 'Try a different search term' : 'Create your first note to get started'}</p>
          {!search && <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={openCreate}>Create Note</button>}
        </div>
      ) : (
        <div className="notes-grid">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} onEdit={openEdit} onDelete={setDeleteNote} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage((p) => p - 1)} disabled={page === 1}>← Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`page-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" onClick={() => setPage((p) => p + 1)} disabled={page === totalPages}>Next →</button>
        </div>
      )}

      {showModal && (
        <NoteModal
          note={editNote}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditNote(null); }}
          loading={saving}
        />
      )}

      {deleteNote && (
        <ConfirmDialog
          message={`Are you sure you want to delete "${deleteNote.title}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteNote(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
