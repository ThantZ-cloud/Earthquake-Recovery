import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import auth from './middleware/auth.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'earthquake-recovery-secret-change-in-production';

app.use(cors());
app.use(express.json());

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// ---------- helpers ----------
function readJSON(filePath) {
  try {
    if (!fs.existsSync(filePath)) return [];
    const raw = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

// =================== AUTH ROUTES ===================

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const filePath = path.join(dataDir, 'users.json');
  const users = readJSON(filePath);

  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = {
    id: Date.now().toString(),
    name,
    email,
    password: hash,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  writeJSON(filePath, users);

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.status(201).json({ token, user: { id: user.id, name, email } });
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const users = readJSON(path.join(dataDir, 'users.json'));
  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '7d',
  });

  return res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

// GET /api/auth/me
app.get('/api/auth/me', auth, (req, res) => {
  const users = readJSON(path.join(dataDir, 'users.json'));
  const user = users.find((u) => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// =================== OTHER ROUTES ===================

// POST /api/subscribe
app.post('/api/subscribe', (req, res) => {
  const { email, region } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  const filePath = path.join(dataDir, 'subscribers.json');
  const subs = readJSON(filePath);

  if (subs.some((s) => s.email === email)) {
    return res.status(409).json({ message: 'Already subscribed!' });
  }

  const entry = {
    id: Date.now(),
    email,
    region: region || 'all',
    subscribedAt: new Date().toISOString(),
  };
  subs.push(entry);
  writeJSON(filePath, subs);

  return res.status(201).json({ message: 'Subscribed successfully!', entry });
});

// POST /api/contact
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }

  const filePath = path.join(dataDir, 'messages.json');
  const messages = readJSON(filePath);

  const entry = {
    id: Date.now(),
    name,
    email,
    message,
    receivedAt: new Date().toISOString(),
  };
  messages.push(entry);
  writeJSON(filePath, messages);

  return res.status(201).json({ message: 'Message sent successfully!', entry });
});

// GET /api/recent — EMSC earthquake data (better Asia coverage)
let quakeCache = null;
let quakeCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

app.get('/api/recent', async (_req, res) => {
  try {
    const now = Date.now();
    if (quakeCache && now - quakeCacheTime < CACHE_TTL) {
      return res.json({ source: 'cache', data: quakeCache });
    }

    // EMSC — better coverage for Asia + Europe than USGS
    const response = await fetch(
      'https://www.seismicportal.eu/fdsnws/event/1/query?format=json&minmag=1&limit=300'
    );
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch earthquake data' });
    }

    const data = await response.json();
    quakeCache = data;
    quakeCacheTime = now;

    return res.json({ source: 'live', data });
  } catch (err) {
    console.error('EMSC fetch error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/health
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`🌍 Earthquake API running on http://localhost:${PORT}`);
});

// Export for Vercel
export default app;
