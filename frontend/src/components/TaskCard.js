import React, { useState } from 'react';
import api from '../api';

export default function TaskCard({ task, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description);
  const [saving, setSaving] = useState(false);

  const toggleComplete = async () => {
    try {
      const updated = await api.put(`/tasks/${task.id}`, { completed: !task.completed });
      onUpdate(updated.data);
    } catch {}
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim()) return;
    setSaving(true);
    try {
      const updated = await api.put(`/tasks/${task.id}`, { title: editTitle.trim(), description: editDesc.trim() });
      onUpdate(updated.data);
      setEditing(false);
    } catch {} finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this task?')) return;
    await api.delete(`/tasks/${task.id}`);
    onDelete(task.id);
  };

  const date = new Date(task.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className={`task-card${task.completed ? ' completed' : ''}`}>
      <div
        className={`task-checkbox${task.completed ? ' checked' : ''}`}
        onClick={toggleComplete}
        role="checkbox"
        aria-checked={!!task.completed}
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && toggleComplete()}
        aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
      />
      {editing ? (
        <form className="task-edit-form" onSubmit={saveEdit}>
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="Task title"
            required
            autoFocus
          />
          <input
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="Description (optional)"
          />
          <div className="task-edit-actions">
            <button type="submit" className="btn-save" disabled={saving}>
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => { setEditing(false); setEditTitle(task.title); setEditDesc(task.description); }}>
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="task-body">
          <div className="task-title">{task.title}</div>
          {task.description && <div className="task-description">{task.description}</div>}
          <div className="task-meta">Created {date}</div>
        </div>
      )}
      {!editing && (
        <div className="task-actions">
          <button className="btn btn-ghost" onClick={() => setEditing(true)} aria-label="Edit task">Edit</button>
          <button className="btn btn-danger" onClick={handleDelete} aria-label="Delete task">Delete</button>
        </div>
      )}
    </div>
  );
}
