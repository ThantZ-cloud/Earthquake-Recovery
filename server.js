import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

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

// ---------- POST /api/subscribe ----------
app.post('/api/subscribe', (req, res) => {
  const { email, region } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }

  const filePath = path.join(dataDir, 'subscribers.json');
  const subs = readJSON(filePath);

  // Prevent duplicate emails
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

// ---------- POST /api/contact ----------
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ error: 'Name, email, and message are required.' });
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

// ---------- GET /api/recent ----------
// Simple in-memory cache for USGS data
let usgsCache = null;
let usgsCacheTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

app.get('/api/recent', async (_req, res) => {
  try {
    const now = Date.now();
    if (usgsCache && now - usgsCacheTime < CACHE_TTL) {
      return res.json({ source: 'cache', data: usgsCache });
    }

    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_hour.geojson'
    );
    if (!response.ok) {
      return res.status(502).json({ error: 'Failed to fetch USGS data' });
    }

    const data = await response.json();
    usgsCache = data;
    usgsCacheTime = now;

    return res.json({ source: 'live', data });
  } catch (err) {
    console.error('USGS fetch error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ---------- GET /api/health ----------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ---------- Start ----------
app.listen(PORT, () => {
  console.log(`🌍 Earthquake API running on http://localhost:${PORT}`);
});
