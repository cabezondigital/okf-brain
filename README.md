# 🌌 OKF Brain

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-brightgreen.svg)](https://nodejs.org/)
[![Standard](https://img.shields.io/badge/Standard-OKF%20v0.2-blueviolet.svg)](https://github.com/OpenKnowledgeFormat/okf-spec)
[![Claude Code](https://img.shields.io/badge/Claude%20Code-Compatible-orange.svg)](https://anthropic.com/)
[![Antigravity](https://img.shields.io/badge/Google%20Antigravity-Ready-4285F4.svg)](https://deepmind.google/)

> **Universal AI Knowledge Vault Framework, Interactive Onboarding CLI & 3D Galaxy Visualizer.**  
> Seamlessly importable into any repository. Native support for **Claude Code**, **Google Antigravity**, and **Cursor**.

---

<p align="center">
  <img src="https://raw.githubusercontent.com/cabezondigital/okf-galaxy-visualizer/main/assets/okf_galaxy_demo.gif" alt="OKF 3D Galaxy Demo" width="100%" style="border-radius: 10px; border: 1px solid #334155;" />
</p>

## 💡 What is OKF Brain?

**OKF Brain** turns any project or workspace into an interconnected, self-learning knowledge vault governed by the **Open Knowledge Format v0.2 (OKF v0.2)**.

Instead of flat, disorganized text files or opaque vector databases, **OKF Brain** models concepts as celestial solar systems:
- **Central Stars (Root Nodes)**: Core project domains (e.g. `Architecture`, `Decisions`, `Contacts`, `Learnings`).
- **Planets (Subnodes)**: Atomic markdown files with strict YAML frontmatter, revolving in Keplerian orbits.
- **Cosmic Splines**: Glowing `[[wikilinks]]` establishing bi-directional neural connections across clusters.
- **Daily Auto-Learning Loop**: Automated synthesis engine that ingests logs/conversations, updates relationships, and consolidates knowledge without manual effort.

---

## ⚡ Quickstart in 60 Seconds

Initialize a self-learning brain in **any existing or new project**:

```bash
npx okf-brain init
```

### The Interactive Onboarding Wizard will guide you:
1. **Vault Location**: Select where notes live (default: `./brain` or `./knowledge_base`).
2. **Project Domain**: Choose your template (*Personal AI Assistant*, *Software Architecture*, *Startup Operations*, *Academic Research*, or *Custom*).
3. **Connected Channels**: Configure integrations (WhatsApp, Slack, GitHub, Postgres, Google Calendar).
4. **AI Assistant Config**: Automatically generates `CLAUDE.md`, `GEMINI.md`, and Antigravity native skills.
5. **Daily Consolidation**: Enable the automated daily learning loop.

---

## 🚀 CLI Commands

| Command | Description |
| :--- | :--- |
| `npx okf-brain init` | Launch the interactive onboarding wizard to scaffold the vault and AI harness files. |
| `npx okf-brain viz` | Launch the real-time WebGL 3D Galaxy Visualizer on `http://localhost:4000/`. |
| `npx okf-brain consolidate` | Run the daily auto-learning loop to synthesize logs and update the brain graph. |
| `npx okf-brain lint` | Validate vault integrity, missing frontmatter IDs, and broken `[[wikilinks]]`. |

---

## 🤖 One-Click AI Prompts (Copy & Paste for Claude & Gemini)

Equip any existing repository or workspace with an **OKF Brain** simply by pasting one of the following prompts into your AI coding assistant:

### 🟣 Prompt for Claude Code
Copy and paste this directly into **Claude Code** (`claude`):

```markdown
I want to equip this workspace with an OKF Brain (Open Knowledge Format v0.2) and a 3D Galaxy Visualizer using the `okf-brain` framework (https://github.com/cabezondigital/okf-brain).

Please execute the following autonomously:
1. Analyze this workspace (package.json, file tree, tech stack, and documentation) to understand its primary domain and architecture.
2. Initialize the OKF Brain vault:
   - Run `npx okf-brain init` or scaffold the vault under `./brain` (or `./knowledge_base`).
   - Configure category clusters tailored to this project (e.g., `architecture`, `decisions`, `specs`, `learnings`).
   - Create root category index files with YAML frontmatter (`isRoot: true`) and initial starter nodes for existing subsystems.
3. Configure Claude Code harnesses:
   - Create or update `CLAUDE.md` specifying the OKF v0.2 frontmatter rules (`id`, `title`, `category`, `tags`, `created`, `updated`) and mandatory `[[wikilinks]]`.
   - Setup `.claude/commands/brain-viz.md` (`/brain-viz`) and `.claude/commands/brain-consolidate.md` (`/brain-consolidate`).
4. Setup the continuous learning pipeline:
   - Configure `./storage/logs` (or `./logs`) for daily conversation and operational history.
   - Run `npx okf-brain consolidate` to verify the daily synthesis loop.
5. Validate graph topology by running `npx okf-brain lint`.
6. Provide instructions on how to view the live 3D Galaxy using `npx okf-brain viz`.
```

---

### 🔵 Prompt for Google Antigravity & Gemini
Copy and paste this directly into **Google Antigravity** or **Gemini**:

```markdown
I want you to integrate the OKF Brain framework (https://github.com/cabezondigital/okf-brain) into this workspace as our persistent, self-learning knowledge base with 3D WebGL Galaxy visualization.

Please perform these setup steps:
1. Workspace Inspection: Explore this repository to identify key domain entities, tech stack, and workflows.
2. Scaffold OKF v0.2 Vault:
   - Initialize the knowledge vault under `./brain` using `npx okf-brain init` or programmatic scaffolding.
   - Create the root celestial stars (e.g., `architecture.md`, `decisions.md`, `learnings.md`) with valid YAML frontmatter.
   - Extract 3-5 existing core architectural patterns from this project into atomic markdown nodes with bidirectional `[[wikilinks]]`.
3. Configure Antigravity Harness & Skills:
   - Create or update `GEMINI.md` mandating that the agent consult `./brain` before undertaking complex refactors and record new learnings upon completion.
   - Create the Antigravity skill in `.agents/skills/okf-brain/SKILL.md` with instructions to read, query, and consolidate knowledge.
4. Verify & Consolidate:
   - Run `npx okf-brain lint` to guarantee zero broken links and valid YAML metadata.
   - Run `npx okf-brain consolidate` to test the automated daily synthesis engine.
5. Launch Visualizer: Confirm the 3D Galaxy Visualizer is ready to run via `npx okf-brain viz`.
```

---

## 🤖 Universal AI Harness Integration

`okf-brain` bridges modern AI pair-programming agents into a shared, standardized mental model:

### 1. Claude Code (`CLAUDE.md` + Slash Commands)
Automatically generates:
- **`CLAUDE.md`**: Enforces OKF v0.2 frontmatter schemas, atomic note guidelines, and semantic linking rules.
- **`.claude/commands/brain-viz.md`**: `/brain-viz` shortcut to launch the 3D galaxy viewer.
- **`.claude/commands/brain-consolidate.md`**: `/brain-consolidate` shortcut to synthesize daily learnings.

### 2. Google Antigravity & Gemini (`GEMINI.md` + Skills)
Automatically generates:
- **`GEMINI.md`**: Context rules instructing Antigravity to consult the brain before undertaking complex tasks.
- **`.agents/skills/okf-brain/SKILL.md`**: Native Antigravity skill with progressive disclosure for reading, querying, and updating the vault.

### 3. Cursor & Windsurf (`.cursorrules`)
Automatically generates:
- **`.cursorrules`**: Context guidelines for inline code completion and chat panels.

---

## 🔄 Automated Daily Learning & Consolidation

Stop losing context between sessions. The continuous learning engine (`okf-brain consolidate`):
1. **Reads Raw Logs**: Inspects daily interaction logs, notes, or conversation histories from `./storage/logs/` or `./logs/`.
2. **Extracts Atomic Knowledge**: Isolates architectural decisions, user preferences, bug fixes, or key contacts.
3. **Establishes Semantic Links**: Creates `[[wikilinks]]` to existing star clusters.
4. **Generates Daily Synthesis**: Creates an immutable record in `learnings/YYYY-MM-DD_daily_consolidation.md`.

---

## 🌌 3D Galaxy Visualizer Engine

Built directly on Three.js and WebGL:
- **Orbital Keplerian Physics**: Planets rotate smoothly around central cluster stars.
- **Armillary Orbit Rings**: Visual celestial wireframes per cluster.
- **Search Spotlight**: Filter nodes in real time; non-matching nodes dim into darkness while targets glow white.
- **Cinematic Fly-To**: Smooth camera interpolation to focused nodes.
- **Speed Slider**: Real-time control from `0.0x` (Orbital Pause) to `3.0x` (Warp Speed).
- **High-DPI Retina Labels**: Crisp, readable typography with proximity LOD.

To launch the visualizer anytime:
```bash
npx okf-brain viz --port 4000
```

---

## 📄 OKF v0.2 Markdown Specification

Every node in an OKF brain follows strict frontmatter formatting:

```markdown
---
id: "unique_kebab_case_id"
title: "Human Readable Title"
category: "architecture"
tags: [database, caching, performance]
created: "2026-09-12"
updated: "2026-09-12"
---

# Title of the Note

Contextual explanation of this concept...

## Semantic Connections
- Belongs to: [[architecture]]
- Intersects with: [[caching_strategies]]
- Used by: [[api_gateway]]
```

---

## 📦 Programmatic API

You can also use `okf-brain` programmatically in Node.js / TypeScript:

```typescript
import { parseOKFVault, consolidateDailyKnowledge, scaffoldVault } from 'okf-brain';

// Parse vault into 3D graph data
const graph = parseOKFVault('./brain');
console.log(`Loaded ${graph.nodes.length} nodes and ${graph.links.length} links.`);

// Trigger daily learning programmatically
const result = consolidateDailyKnowledge(process.cwd());
console.log(`Consolidated ${result.createdNodes.length} new nodes.`);
```

---

## 📜 License

MIT © [Yoco](https://github.com/cabezondigital) & OKF Community.
