const express = require('express');
const db = require('../db');
const auth = require('../middleware/auth');

const router = express.Router();

router.use(auth);

router.get('/', (req, res) => {
  try {
    const tasks = db
      .prepare('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC')
      .all(req.user.id);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/', (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Title is required' });
  }

  try {
    const result = db
      .prepare('INSERT INTO tasks (user_id, title, description) VALUES (?, ?, ?)')
      .run(req.user.id, title, description || null);

    const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/:id', (req, res) => {
  const { title, description, completed } = req.body;
  const taskId = req.params.id;

  try {
    const task = db
      .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
      .get(taskId, req.user.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    db.prepare(
      'UPDATE tasks SET title = ?, description = ?, completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(
      title !== undefined ? title : task.title,
      description !== undefined ? description : task.description,
      completed !== undefined ? (completed ? 1 : 0) : task.completed,
      taskId
    );

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.delete('/:id', (req, res) => {
  const taskId = req.params.id;

  try {
    const task = db
      .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
      .get(taskId, req.user.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(taskId);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/toggle', (req, res) => {
  const taskId = req.params.id;

  try {
    const task = db
      .prepare('SELECT * FROM tasks WHERE id = ? AND user_id = ?')
      .get(taskId, req.user.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    db.prepare(
      'UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?'
    ).run(task.completed ? 0 : 1, taskId);

    const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(taskId);
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
