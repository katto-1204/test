'use client';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  return (
    <div
      className={`bg-white rounded-xl border shadow-sm px-5 py-4 flex items-start gap-4 transition ${
        task.completed ? 'opacity-70 border-gray-100' : 'border-gray-200'
      }`}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={!!task.completed}
        onChange={() => onToggle(task.id)}
        className="mt-1 h-4 w-4 accent-indigo-600 cursor-pointer flex-shrink-0"
      />

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium text-gray-800 break-words ${
            task.completed ? 'line-through text-gray-400' : ''
          }`}
        >
          {task.title}
        </p>
        {task.description && (
          <p className="text-sm text-gray-500 mt-0.5 break-words">{task.description}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onEdit(task)}
          className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2 py-1 rounded hover:bg-indigo-50 transition"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="text-xs text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded hover:bg-red-50 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
