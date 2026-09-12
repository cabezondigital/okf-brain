import fs from 'fs';
import path from 'path';
import { OKFConfig } from '../types.js';

export function generateAIHarnesses(cwd: string, config: OKFConfig) {
  const assistants = new Set(config.aiAssistants.map(a => a.toLowerCase()));
  const isAll = assistants.has('all');

  // 1. Generate CLAUDE.md for Claude Code
  if (isAll || assistants.has('claude') || assistants.has('claude-code')) {
    generateClaudeMD(cwd, config);
  }

  // 2. Generate GEMINI.md & Antigravity Skill
  if (isAll || assistants.has('antigravity') || assistants.has('gemini')) {
    generateAntigravityHarness(cwd, config);
  }

  // 3. Generate .cursorrules for Cursor / Windsurf
  if (isAll || assistants.has('cursor') || assistants.has('windsurf')) {
    generateCursorRules(cwd, config);
  }
}

function generateClaudeMD(cwd: string, config: OKFConfig) {
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');
  const content = `# CLAUDE.md - ${config.projectName} Knowledge Guidelines

## 🌐 Language Mandate
- **Workspace Language**: **${config.language.toUpperCase()}** (${config.language.startsWith('es') ? 'Español' : 'English'}).
- All newly created knowledge notes, titles, tags, and daily consolidations MUST be written in **${config.language.startsWith('es') ? 'Español' : 'English'}**.

---

## 🌌 OKF Brain & Vault Architecture

This workspace uses the **Open Knowledge Format v0.2 (OKF v0.2)** to manage its memory and knowledge graph. The vault is located at:
- **Vault Directory**: \`${config.vaultPath}\`
- **Specification**: OKF v0.2 YAML Frontmatter + [[wikilinks]]
- **Visualizer**: Real-time 3D Galaxy graph accessible via \`npx okf-brain viz\`

---

## 📝 Rules for Creating & Updating Knowledge Nodes

Whenever you learn new architectural facts, user preferences, client details, meeting outcomes, or technical solutions:

1. **Format Specification (Strict OKF v0.2)**:
   Every markdown file in \`${config.vaultPath}\` MUST begin with YAML frontmatter:
   \`\`\`yaml
   ---
   id: "kebab_case_unique_identifier"
   title: "Clean Human Readable Title"
   category: "${config.categories[0]?.id || 'learnings'}"
   tags: [tag1, tag2]
   created: "YYYY-MM-DD"
   updated: "YYYY-MM-DD"
   ---
   \`\`\`

2. **Categorization**:
   Organize notes into their proper category folder:
${config.categories.map(c => `   - \`${c.id}/\`: ${c.label} (${c.description})`).join('\n')}

3. **Semantic Linking**:
   - Always connect new nodes to their root category: \`[[${config.categories[0]?.id || 'learnings'}]]\`.
   - Always connect to relevant related nodes using \`[[node_id]]\` or \`[[Node Title]]\`.
   - These links form the glowing cosmic splines and orbital paths in the 3D Galaxy Visualizer.

4. **Daily Auto-Learning & Consolidation**:
   - Review recent logs in \`${config.autoLearn.logsPath}\` or user interaction.
   - Run \`npx okf-brain consolidate\` or synthesize notes directly into \`${config.vaultPath}/learnings/\`.

---

## 🛠️ Slash Commands & Utility Scripts

- **View 3D Galaxy Graph**: Run \`npx okf-brain viz\`
- **Run Brain Consolidation**: Run \`npx okf-brain consolidate\`
- **Lint Brain Integrity**: Run \`npx okf-brain lint\`
`;

  fs.writeFileSync(claudeMdPath, content, 'utf-8');

  // Also create .claude/commands/ if requested
  const claudeCmdDir = path.join(cwd, '.claude', 'commands');
  fs.mkdirSync(claudeCmdDir, { recursive: true });
  fs.writeFileSync(path.join(claudeCmdDir, 'brain-viz.md'), `Launch the OKF 3D Galaxy Visualizer:\n\`\`\`bash\nnpx okf-brain viz\n\`\`\``);
  fs.writeFileSync(path.join(claudeCmdDir, 'brain-consolidate.md'), `Consolidate today's learnings into the OKF brain:\n\`\`\`bash\nnpx okf-brain consolidate\n\`\`\``);
}

function generateAntigravityHarness(cwd: string, config: OKFConfig) {
  // 1. GEMINI.md in project root
  const geminiMdPath = path.join(cwd, 'GEMINI.md');
  const content = `# GEMINI.md - ${config.projectName} Project Guidelines

## 🌌 OKF Brain Integration (Active Knowledge Base)

This project maintains an active, self-learning knowledge graph under \`${config.vaultPath}\` compliant with **Open Knowledge Format v0.2**.

### 🌐 Language Mandate:
- **Language**: **${config.language.toUpperCase()}** (${config.language.startsWith('es') ? 'Español' : 'English'}).
- All notes, decisions, and summaries created in \`${config.vaultPath}\` must be in **${config.language.startsWith('es') ? 'Español' : 'English'}**.

### Agent Workflow Protocol:
1. **Mandatory Check**: Before starting any non-trivial coding or architectural task, inspect \`${config.vaultPath}\` for established patterns, ADRs, or user preferences.
2. **Atomic Knowledge Contribution**:
   - When introducing new patterns, decisions, or fixes, write an atomic node in \`${config.vaultPath}/<category>/\`.
   - Strictly follow the YAML frontmatter schema:
     \`\`\`yaml
     ---
     id: "kebab_case_id"
     title: "Descriptive Title"
     category: "category_name"
     tags: [tag1, tag2]
     created: "YYYY-MM-DD"
     updated: "YYYY-MM-DD"
     ---
     \`\`\`
   - Connect concepts with bidirectional \`[[wikilinks]]\`.
3. **Daily Consolidation**:
   - The knowledge base evolves automatically via \`npx okf-brain consolidate\`.
   - Never remove nodes without verifying connections.
`;
  fs.writeFileSync(geminiMdPath, content, 'utf-8');

  // 2. Register Antigravity Skill in .agents/skills/okf-brain/
  const skillDir = path.join(cwd, '.agents', 'skills', 'okf-brain');
  fs.mkdirSync(skillDir, { recursive: true });

  const skillMd = `---
name: okf-brain
description: Interact with, query, lint, and consolidate the project OKF v0.2 3D Knowledge Brain.
---

# OKF Brain Skill for Antigravity

This skill allows Antigravity agents to read, query, validate, and trigger daily consolidation for the Open Knowledge Format (OKF) vault.

## Vault Location: \`${config.vaultPath}\`

### Core Commands:
- **Inspect Graph Topology**: \`npx okf-brain lint\`
- **Run Daily Learning Consolidation**: \`npx okf-brain consolidate\`
- **Launch 3D WebGL Galaxy Visualizer**: \`npx okf-brain viz\`

### Linking Rules:
- Enforce \`[[wikilinks]]\` for all concept cross-references.
- Each node must belong to one of: ${config.categories.map(c => `\`${c.id}\``).join(', ')}.
`;
  fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillMd, 'utf-8');
}

function generateCursorRules(cwd: string, config: OKFConfig) {
  const cursorRulesPath = path.join(cwd, '.cursorrules');
  const content = `# Cursor / Windsurf Rules for ${config.projectName}

- Always respect the OKF v0.2 vault at \`${config.vaultPath}\`.
- Every markdown note in the vault must have valid YAML frontmatter (id, title, category, tags, created, updated).
- Link related notes using [[wikilinks]] notation.
- Run \`npx okf-brain viz\` to preview the 3D galaxy graph.
`;
  fs.writeFileSync(cursorRulesPath, content, 'utf-8');
}
