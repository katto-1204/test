'use client';

import { useState } from 'react';

export default function TaskForm({ task, onSubmit, onCancel }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title: title.trim(), description: description.trim() });
  }

  const isEditing = !!task;

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        {isEditing ? 'Edit Task' : 'New Task'}
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            autoFocus
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            placeholder="What needs to be done?"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description <span className="text-gray-400 font-normal">(optional)</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent resize-none"
            placeholder="Add more details…"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button
          type="submit"
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-5 py-2 rounded-lg transition"
        >
          {isEditing ? 'Update Task' : 'Create Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="text-sm text-gray-500 hover:text-gray-700 font-medium px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
