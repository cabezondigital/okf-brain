import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { parseOKFVault } from '../core/parser.js';

export function startVisualizerServer(vaultDir: string, port = 4000) {
  const app = express();
  app.use(cors());

  // Determine static files directory
  let publicDir = path.resolve(__dirname, 'public');
  if (!fs.existsSync(publicDir)) {
    publicDir = path.resolve(__dirname, '..', 'src', 'visualizer', 'public');
  }
  if (!fs.existsSync(publicDir)) {
    publicDir = path.resolve(process.cwd(), 'src', 'visualizer', 'public');
  }

  app.use(express.static(publicDir));

  // Serve live graph data parsed directly from disk
  app.get('/api/graph', (req, res) => {
    try {
      const targetDir = path.resolve(process.cwd(), vaultDir);
      const graphData = parseOKFVault(targetDir);
      res.json(graphData);
    } catch (err) {
      console.error('[Visualizer Error] Failed to parse vault:', err);
      res.status(500).json({ error: String(err) });
    }
  });

  app.get('/api/stats', (req, res) => {
    try {
      const targetDir = path.resolve(process.cwd(), vaultDir);
      const graphData = parseOKFVault(targetDir);
      const categoryCount: Record<string, number> = {};
      graphData.nodes.forEach(n => {
        categoryCount[n.group] = (categoryCount[n.group] || 0) + 1;
      });
      res.json({
        totalNodes: graphData.nodes.length,
        totalLinks: graphData.links.length,
        rootClusters: graphData.nodes.filter(n => n.isRoot).length,
        categories: categoryCount
      });
    } catch (err) {
      res.status(500).json({ error: String(err) });
    }
  });

  const server = app.listen(port, () => {
    console.log(`\n🌌 [OKF Brain Visualizer] Live 3D Galaxy running at: http://localhost:${port}/`);
    console.log(`📁 Reading vault from: ${path.resolve(process.cwd(), vaultDir)}\n`);
  });

  return server;
}
