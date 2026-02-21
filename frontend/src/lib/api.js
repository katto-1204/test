const API_URL = 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, options);
  const data = await res.json();
  if (!res.ok) {
    if (res.status === 401) throw new Error('Unauthorized');
    throw new Error(data.message || 'Request failed');
  }
  return data;
}

export async function signup(username, email, password) {
  return request('/api/auth/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password }),
  });
}

export async function login(email, password) {
  return request('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
}

export async function getTasks() {
  return request('/api/tasks', {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export async function createTask(title, description) {
  return request('/api/tasks', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ title, description }),
  });
}

export async function updateTask(id, data) {
  return request(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(data),
  });
}

export async function deleteTask(id) {
  return request(`/api/tasks/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}

export async function toggleTask(id) {
  return request(`/api/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${getToken()}` },
  });
}
