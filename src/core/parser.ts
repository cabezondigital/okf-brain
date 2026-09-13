import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { GraphData, GraphNode, GraphLink, OKFNodeMetadata } from '../types.js';

const CATEGORY_COLORS: Record<string, string> = {
  contacts: '#38bdf8',
  events: '#a855f7',
  learnings: '#34d399',
  architecture: '#f59e0b',
  decisions: '#ec4899',
  projects: '#6366f1',
  strategy: '#f97316',
  specs: '#10b981',
  dependencies: '#06b6d4',
  meetings: '#8b5cf6',
  preferences: '#f43f5e',
  expenses: '#eab308',
  expense: '#eab308',
  default: '#38bdf8'
};

export function parseOKFVault(vaultDir: string): GraphData {
  const nodesMap = new Map<string, GraphNode>();
  const links: GraphLink[] = [];
  const nodeDegrees = new Map<string, number>();

  if (!fs.existsSync(vaultDir)) {
    return { nodes: [], links: [] };
  }

  function readDirectoryRecursive(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!entry.name.startsWith('.')) {
          readDirectoryRecursive(fullPath);
        }
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        parseMarkdownFile(fullPath, vaultDir);
      }
    }
  }

  function parseMarkdownFile(filePath: string, rootDir: string) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const relative = path.relative(rootDir, filePath);
    const parts = relative.split(path.sep);
    
    // Auto infer category from folder or file
    let inferredCategory = 'default';
    if (parts.length > 1) {
      inferredCategory = parts[0].toLowerCase();
    } else {
      inferredCategory = path.basename(filePath, '.md').toLowerCase();
    }

    let frontmatter: Record<string, any> = {};
    let content = raw;

    const fmMatch = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
    if (fmMatch) {
      try {
        frontmatter = yaml.parse(fmMatch[1]) || {};
        content = raw.slice(fmMatch[0].length);
      } catch (e) {
        console.warn(`[OKF Parser] Failed to parse frontmatter in ${filePath}:`, e);
      }
    }

    const fileBaseName = path.basename(filePath, '.md');
    const nodeId = (frontmatter.id || fileBaseName).toString().trim();
    const title = (frontmatter.title || fileBaseName.replace(/_/g, ' ').replace(/-/g, ' ')).toString().trim();
    const category = (frontmatter.category || inferredCategory).toString().toLowerCase().trim();
    const isRoot = !!frontmatter.isRoot || parts.length === 1;

    const color = frontmatter.color || CATEGORY_COLORS[category] || CATEGORY_COLORS.default;

    const node: GraphNode = {
      id: nodeId,
      label: title,
      group: category,
      color,
      isRoot,
      filePath,
      metadata: frontmatter as OKFNodeMetadata,
      content
    };

    nodesMap.set(nodeId, node);
    // Also alias by title and basename for [[wikilink]] resolution
    nodesMap.set(fileBaseName, node);
    nodesMap.set(title.toLowerCase(), node);

    // Extract [[wikilinks]]
    const wikilinkRegex = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;
    let match;
    while ((match = wikilinkRegex.exec(raw)) !== null) {
      const targetName = match[1].trim();
      links.push({
        source: nodeId,
        target: targetName,
        isStructural: false,
        label: match[2] ? match[2].trim() : undefined
      });
    }
  }

  readDirectoryRecursive(vaultDir);

  // Group nodes by category to establish root centers
  const categoryRoots = new Map<string, GraphNode>();
  for (const node of nodesMap.values()) {
    if (node.isRoot) {
      categoryRoots.set(node.group, node);
    }
  }

  // Create virtual roots if category has no explicit root file
  for (const node of nodesMap.values()) {
    if (!node.isRoot && !categoryRoots.has(node.group)) {
      const virtualRootId = `root_${node.group}`;
      if (!nodesMap.has(virtualRootId)) {
        const virtualRoot: GraphNode = {
          id: virtualRootId,
          label: node.group.toUpperCase(),
          group: node.group,
          color: CATEGORY_COLORS[node.group] || CATEGORY_COLORS.default,
          isRoot: true,
          content: `# ${node.group.toUpperCase()} Root System\nCentral category cluster.`
        };
        nodesMap.set(virtualRootId, virtualRoot);
        categoryRoots.set(node.group, virtualRoot);
      }
    }
  }

  // Add structural links between subnodes and their category root
  for (const node of nodesMap.values()) {
    if (!node.isRoot) {
      const root = categoryRoots.get(node.group);
      if (root) {
        links.push({
          source: root.id,
          target: node.id,
          isStructural: true
        });
      }
    }
  }

  // Deduplicate and resolve unique nodes
  const uniqueNodes = Array.from(new Set(nodesMap.values()));
  const validNodeIds = new Set(uniqueNodes.map(n => n.id));

  // Resolve link targets to real node IDs and filter dead links
  const validLinks: GraphLink[] = [];
  for (const l of links) {
    const sId = typeof l.source === 'string' ? l.source : l.source.id;
    const tRaw = typeof l.target === 'string' ? l.target : l.target.id;

    let resolvedTargetId = tRaw;
    if (!validNodeIds.has(tRaw)) {
      // Try alias lookup
      const aliasNode = nodesMap.get(tRaw) || nodesMap.get(tRaw.toLowerCase());
      if (aliasNode) {
        resolvedTargetId = aliasNode.id;
      }
    }

    if (validNodeIds.has(sId) && validNodeIds.has(resolvedTargetId) && sId !== resolvedTargetId) {
      validLinks.push({
        source: sId,
        target: resolvedTargetId,
        isStructural: !!l.isStructural,
        label: l.label
      });

      nodeDegrees.set(sId, (nodeDegrees.get(sId) || 0) + 1);
      nodeDegrees.set(resolvedTargetId, (nodeDegrees.get(resolvedTargetId) || 0) + 1);
    }
  }

  // Assign node sizes based on degree
  for (const n of uniqueNodes) {
    const deg = nodeDegrees.get(n.id) || 1;
    n.size = n.isRoot ? 24 : Math.max(6, Math.min(18, 5 + deg * 2.2));
  }

  return { nodes: uniqueNodes, links: validLinks };
}
