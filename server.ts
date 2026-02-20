import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import db from './src/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'securescan-super-secret';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Security Middleware ---
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https://picsum.photos; connect-src 'self'");
    next();
  });

  // --- Auth Routes ---
  app.post('/api/auth/register', async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const stmt = db.prepare('INSERT INTO users (email, password_hash) VALUES (?, ?)');
      const result = stmt.run(email, hashedPassword);
      res.json({ success: true, userId: result.lastInsertRowid });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    const user: any = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (user && await bcrypt.compare(password, user.password_hash)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
    } else {
      res.status(401).json({ error: 'Invalid credentials' });
    }
  });

  // --- Scan Routes ---
  app.post('/api/scan', async (req, res) => {
    const { url, userId } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    try {
      // Use Gemini for intelligent analysis following the requested formula
      const model = 'gemini-3-flash-preview';
      const prompt = `Analyze the following URL for security threats: ${url}. 
      Calculate a Risk Score (0-100) based on these weights:
      - Blacklist weight (30%)
      - Domain age weight (15%)
      - SSL validity weight (10%)
      - Redirect chain weight (10%)
      - IP reputation (15%)
      - Phishing indicators (20%)

      Scoring Guide:
      0-30: Safe
      31-70: Suspicious
      71-100: Malicious

      Provide a JSON response with:
      - risk_score: number
      - threat_level: "Safe" | "Suspicious" | "Malicious"
      - breakdown: {
          blacklist: number,
          domain_age: number,
          ssl_validity: number,
          redirect_chain: number,
          ip_reputation: number,
          phishing_indicators: number
        }
      - checks: {
          dns_lookup: string,
          whois_data: string,
          ssl_status: string,
          blacklist_check: string,
          phishing_check: string,
          redirect_analysis: string,
          malware_signature: string,
          ip_reputation: string,
          suspicious_keywords: string,
          homograph_detection: string
        }
      - recommendations: string[]
      - summary: string
      Only return valid JSON.`;

      const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const analysis = JSON.parse(response.text || '{}');
      
      const stmt = db.prepare(`
        INSERT INTO scans (user_id, url, risk_score, threat_level, scan_result_json)
        VALUES (?, ?, ?, ?, ?)
      `);
      const result = stmt.run(userId || null, url, analysis.risk_score, analysis.threat_level, JSON.stringify(analysis));

      res.json({ id: result.lastInsertRowid, ...analysis });
    } catch (error: any) {
      console.error('Scan error:', error);
      res.status(500).json({ error: 'Failed to scan URL' });
    }
  });

  app.get('/api/history', (req, res) => {
    const userId = req.query.userId;
    const scans = db.prepare('SELECT * FROM scans ORDER BY created_at DESC LIMIT 50').all();
    res.json(scans.map((s: any) => ({ ...s, scan_result: JSON.parse(s.scan_result_json) })));
  });

  app.get('/api/dashboard-stats', (req, res) => {
    const totalScans = db.prepare('SELECT COUNT(*) as count FROM scans').get() as any;
    const maliciousScans = db.prepare("SELECT COUNT(*) as count FROM scans WHERE threat_level = 'Malicious'").get() as any;
    const suspiciousScans = db.prepare("SELECT COUNT(*) as count FROM scans WHERE threat_level = 'Suspicious'").get() as any;
    const safeScans = db.prepare("SELECT COUNT(*) as count FROM scans WHERE threat_level = 'Safe'").get() as any;
    
    const recentScans = db.prepare('SELECT * FROM scans ORDER BY created_at DESC LIMIT 10').all();
    
    // Top risk domains
    const topRiskDomains = db.prepare(`
      SELECT url, risk_score, threat_level, created_at 
      FROM scans 
      WHERE threat_level != 'Safe'
      ORDER BY risk_score DESC 
      LIMIT 5
    `).all();

    const trend = db.prepare(`
      SELECT date(created_at) as date, COUNT(*) as count 
      FROM scans 
      GROUP BY date(created_at) 
      ORDER BY date DESC 
      LIMIT 7
    `).all();

    res.json({
      totalScans: totalScans.count,
      maliciousScans: maliciousScans.count,
      suspiciousScans: suspiciousScans.count,
      safeScans: safeScans.count,
      recentScans: recentScans.map((s: any) => ({ ...s, scan_result: JSON.parse(s.scan_result_json) })),
      topRiskDomains: topRiskDomains.map((s: any) => ({ ...s, scan_result: JSON.parse(s.scan_result_json) })),
      trend: trend.reverse()
    });
  });

  // --- Vite Middleware ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
