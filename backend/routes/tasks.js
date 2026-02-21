const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

// GET /api/tasks - list all tasks for current user
router.get('/', (req, res) => {
  const tasks = db.prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC').all(req.userId);
  res.json(tasks);
});

// POST /api/tasks - create a new task
router.post('/', (req, res) => {
  const { title, description } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  const result = db.prepare('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)').run(req.userId, title, description || '');
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(task);
});

// PUT /api/tasks/:id - update a task
router.put('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  const { title, description, completed } = req.body;
  const updatedTitle = title !== undefined ? title : task.title;
  const updatedDescription = description !== undefined ? description : task.description;
  const updatedCompleted = completed !== undefined ? (completed ? 1 : 0) : task.completed;
  db.prepare('UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
    .run(updatedTitle, updatedDescription, updatedCompleted, task.id);
  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(task.id);
  res.json(updated);
});

// DELETE /api/tasks/:id - delete a task
router.delete('/:id', (req, res) => {
  const task = db.prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!task) return res.status(404).json({ error: 'Task not found' });
  db.prepare('DELETE FROM tasks WHERE id = ?').run(task.id);
  res.json({ message: 'Task deleted' });
});

module.exports = router;
