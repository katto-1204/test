'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from '@/lib/api';
import TaskCard from '@/components/TaskCard';
import TaskForm from '@/components/TaskForm';

export default function DashboardPage() {
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      if (err.message === 'Unauthorized') {
        localStorage.removeItem('token');
        router.push('/login');
      } else {
        setError('Failed to load tasks');
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.replace('/login');
      return;
    }
    loadTasks();
  }, [router, loadTasks]);

  function handleLogout() {
    localStorage.removeItem('token');
    router.push('/login');
  }

  async function handleCreateTask({ title, description }) {
    try {
      const task = await createTask(title, description);
      setTasks((prev) => [task, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Failed to create task');
    }
  }

  async function handleUpdateTask({ title, description }) {
    try {
      const updated = await updateTask(editingTask.id, { title, description });
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
      setEditingTask(null);
    } catch (err) {
      setError('Failed to update task');
    }
  }

  async function handleToggle(id) {
    try {
      const updated = await toggleTask(id);
      setTasks((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
    } catch (err) {
      setError('Failed to toggle task');
    }
  }

  async function handleDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError('Failed to delete task');
    }
  }

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">TaskTracker</h1>
          <button
            onClick={handleLogout}
            className="text-sm text-gray-500 hover:text-red-600 font-medium transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats bar */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-500 text-sm">
              {completedCount} of {tasks.length} tasks completed
            </p>
          </div>
          <button
            onClick={() => { setShowForm(true); setEditingTask(null); }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            <span className="text-lg leading-none">+</span> New Task
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 mb-4 text-sm">
            {error}
            <button onClick={() => setError('')} className="float-right font-bold">×</button>
          </div>
        )}

        {/* Task Form (inline) */}
        {(showForm || editingTask) && (
          <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <TaskForm
              task={editingTask}
              onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
              onCancel={() => { setShowForm(false); setEditingTask(null); }}
            />
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading tasks…</div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No tasks yet.</p>
            <p className="text-gray-400 text-sm mt-1">Click &quot;+ New Task&quot; to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onEdit={(t) => { setEditingTask(t); setShowForm(false); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
