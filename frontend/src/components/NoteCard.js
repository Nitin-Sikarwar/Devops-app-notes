import React from 'react';

const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function NoteCard({ note, onEdit, onDelete }) {
  const tags = note.tags ? note.tags.split(',').map((t) => t.trim()).filter(Boolean) : [];

  return (
    <div className="note-card">
      <div className="note-card-header">
        <h3 className="note-card-title">{note.title}</h3>
        <div className="note-card-actions">
          <button className="btn-icon" onClick={() => onEdit(note)} title="Edit">✏️</button>
          <button className="btn-icon" onClick={() => onDelete(note)} title="Delete">🗑️</button>
        </div>
      </div>
      <p className="note-card-content">{note.content}</p>
      <div className="note-card-footer">
        <span className="note-card-date">{formatDate(note.updated_at)}</span>
        {tags.length > 0 && (
          <div className="note-tags">
            {tags.slice(0, 3).map((tag) => <span key={tag} className="tag">{tag}</span>)}
          </div>
        )}
      </div>
    </div>
  );
}
