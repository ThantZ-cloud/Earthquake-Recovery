import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import auth from './middleware/auth.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'earthquake-recovery-secret-change-in-production';

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: 'Email already registered.' });
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hash },
  });

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

  const user = await prisma.user.findUnique({ where: { email } });
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
app.get('/api/auth/me', auth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.user.id } });
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }
  return res.json({ user: { id: user.id, name: user.name, email: user.email } });
});

// =================== LOCATION ROUTES ===================

// POST /api/user/locations — save a location
app.post('/api/user/locations', auth, async (req, res) => {
  const { latitude, longitude, label, radius } = req.body;
  if (latitude == null || longitude == null) {
    return res.status(400).json({ error: 'Latitude and longitude are required.' });
  }

  const location = await prisma.location.create({
    data: {
      userId: req.user.id,
      latitude,
      longitude,
      label: label || null,
      radius: radius || 50,
    },
  });

  return res.status(201).json({ location });
});

// GET /api/user/locations — get all locations for logged-in user
app.get('/api/user/locations', auth, async (req, res) => {
  const locations = await prisma.location.findMany({
    where: { userId: req.user.id },
    orderBy: { createdAt: 'desc' },
  });
  return res.json({ locations });
});

// DELETE /api/user/locations/:id — remove a location
app.delete('/api/user/locations/:id', auth, async (req, res) => {
  const location = await prisma.location.findUnique({ where: { id: req.params.id } });
  if (!location || location.userId !== req.user.id) {
    return res.status(404).json({ error: 'Location not found.' });
  }

  await prisma.location.delete({ where: { id: req.params.id } });
  return res.json({ message: 'Location deleted.' });
});

// =================== OTHER ROUTES ===================

// POST /api/subscribe
app.post('/api/subscribe', (req, res) => {
  const { email, region } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email is required.' });
  }
  // TODO: migrate to Prisma when Subscriber model is added
  return res.status(201).json({ message: 'Subscribed successfully!', entry: { email, region: region || 'all' } });
});

// POST /api/contact
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required.' });
  }
  // TODO: migrate to Prisma when Message model is added
  return res.status(201).json({ message: 'Message sent successfully!', entry: { name, email, message } });
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
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🌍 Earthquake API running on http://0.0.0.0:${PORT}`);
});

// Export for Vercel
export default app;
