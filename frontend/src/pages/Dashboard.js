import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/tasks').then((res) => setTasks(res.data)).catch(() => {});
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setAdding(true);
    setError('');
    try {
      const res = await api.post('/tasks', { title: newTitle.trim(), description: newDesc.trim() });
      setTasks((prev) => [res.data, ...prev]);
      setNewTitle('');
      setNewDesc('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add task.');
    } finally {
      setAdding(false);
    }
  };

  const updateTask = (updated) => setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id));

  const filtered = tasks.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;

  return (
    <div className="dashboard">
      <nav className="navbar">
        <span className="navbar-brand">✅ TaskTracker</span>
        <div className="navbar-user">
          <span>Hello, {user?.name}</span>
          <button className="btn-logout" onClick={logout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-value">{total}</div>
            <div className="stat-label">Total Tasks</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{active}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{completed}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>

        <div className="add-task-form">
          <h2>Add New Task</h2>
          {error && <div className="error-msg">{error}</div>}
          <form onSubmit={addTask}>
            <div className="form-row">
              <input
                type="text"
                placeholder="Task title *"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                required
              />
              <input
                type="text"
                placeholder="Description (optional)"
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
              />
              <button type="submit" className="btn-add" disabled={adding}>
                {adding ? 'Adding…' : '+ Add Task'}
              </button>
            </div>
          </form>
        </div>

        <div className="task-filters">
          {['all', 'active', 'completed'].map((f) => (
            <button
              key={f}
              className={`filter-btn${filter === f ? ' active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <div className="task-list">
          {filtered.length === 0 ? (
            <div className="task-empty">
              {filter === 'all' ? 'No tasks yet. Add one above!' : `No ${filter} tasks.`}
            </div>
          ) : (
            filtered.map((task) => (
              <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
