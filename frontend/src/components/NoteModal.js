import React, { useState, useEffect } from 'react';

const INIT = { title: '', content: '', tags: '' };

export default function NoteModal({ note, onSave, onClose, loading }) {
  const [form, setForm] = useState(INIT);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(note ? { title: note.title, content: note.content, tags: note.tags || '' } : INIT);
    setErrors({});
  }, [note]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.content.trim()) e.content = 'Content is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length) return setErrors(e2);
    onSave(form);
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">{note ? 'Edit Note' : 'New Note'}</h2>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input className={`form-input ${errors.title ? 'error' : ''}`} value={form.title} onChange={set('title')} placeholder="Note title" maxLength={200} />
              {errors.title && <p className="form-error">{errors.title}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Content *</label>
              <textarea className={`form-input form-textarea ${errors.content ? 'error' : ''}`} value={form.content} onChange={set('content')} placeholder="Write your note..." rows={6} />
              {errors.content && <p className="form-error">{errors.content}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Tags <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma separated)</span></label>
              <input className="form-input" value={form.tags} onChange={set('tags')} placeholder="devops, kubernetes, docker" />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : note ? 'Update Note' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
