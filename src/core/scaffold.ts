import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { OnboardingAnswers, OKFConfig } from '../types.js';

export const DOMAIN_PRESETS: Record<string, { categories: Array<{ id: string; label: string; description: string; color: string }> }> = {
  assistant: {
    categories: [
      { id: 'contacts', label: 'Contacts & VIPs', description: 'Profiles, relationships, and interaction notes', color: '#38bdf8' },
      { id: 'events', label: 'Events & Dinners', description: 'Galas, conferences, meetings, and calendar events', color: '#a855f7' },
      { id: 'learnings', label: 'Learnings & Knowledge', description: 'Daily synthesized insights and discoveries', color: '#34d399' },
      { id: 'projects', label: 'Projects & Ventures', description: 'Active ventures, roadmaps, and milestones', color: '#6366f1' },
      { id: 'preferences', label: 'Preferences & Lifestyle', description: 'Dietary, travel, luxury, and operational habits', color: '#f43f5e' }
    ]
  },
  software: {
    categories: [
      { id: 'architecture', label: 'System Architecture', description: 'Core topologies, subsystems, and data flows', color: '#f59e0b' },
      { id: 'decisions', label: 'Architecture Decisions (ADRs)', description: 'Immutable records of design choices and rationale', color: '#ec4899' },
      { id: 'specs', label: 'Product Specs & APIs', description: 'Feature requirements and API contracts', color: '#10b981' },
      { id: 'dependencies', label: 'Dependencies & Tech Stack', description: 'Libraries, versions, and third-party services', color: '#06b6d4' },
      { id: 'learnings', label: 'Postmortems & Learnings', description: 'Incident investigations, bug fixes, and lessons learned', color: '#34d399' }
    ]
  },
  business: {
    categories: [
      { id: 'clients', label: 'Clients & Accounts', description: 'Key client accounts and organizational charts', color: '#38bdf8' },
      { id: 'deals', label: 'Deals & Pipeline', description: 'Sales opportunities, terms, and contract stages', color: '#f97316' },
      { id: 'strategy', label: 'Strategy & OKRs', description: 'High-level business objectives and market positioning', color: '#a855f7' },
      { id: 'operations', label: 'Operations & Playbooks', description: 'Standard operating procedures and runbooks', color: '#6366f1' },
      { id: 'meetings', label: 'Executive Meetings', description: 'Board meetings, syncs, and strategic summaries', color: '#10b981' }
    ]
  },
  research: {
    categories: [
      { id: 'papers', label: 'Literature & Papers', description: 'Academic papers, summaries, and bibliographies', color: '#6366f1' },
      { id: 'hypotheses', label: 'Hypotheses & Questions', description: 'Core scientific propositions and assumptions', color: '#ec4899' },
      { id: 'experiments', label: 'Experiments & Benchmarks', description: 'Methodologies, test setups, and execution runs', color: '#f59e0b' },
      { id: 'findings', label: 'Findings & Conclusions', description: 'Empirical results, charts, and verified insights', color: '#34d399' }
    ]
  },
  custom: {
    categories: [
      { id: 'concepts', label: 'Core Concepts', description: 'Fundamental pillars of knowledge', color: '#38bdf8' },
      { id: 'notes', label: 'Notes & Ideas', description: 'Working thoughts and unstructured inputs', color: '#a855f7' },
      { id: 'learnings', label: 'Learnings', description: 'Verified insights and daily consolidations', color: '#34d399' }
    ]
  }
};

export function scaffoldVault(cwd: string, answers: OnboardingAnswers): OKFConfig {
  const targetVaultDir = path.resolve(cwd, answers.vaultPath);
  fs.mkdirSync(targetVaultDir, { recursive: true });

  const domainPreset = DOMAIN_PRESETS[answers.domain] || DOMAIN_PRESETS.custom;
  const categoriesToCreate = domainPreset.categories.filter(c => 
    answers.categories.length === 0 || answers.categories.includes(c.id) || answers.categories.includes(c.label)
  );

  const today = new Date().toISOString().split('T')[0];

  // 1. Create category folders and Root Index files
  for (const cat of categoriesToCreate) {
    const catDir = path.join(targetVaultDir, cat.id);
    fs.mkdirSync(catDir, { recursive: true });

    // Root index file (acts as the Sun of this star cluster in 3D Galaxy)
    const rootFilePath = path.join(targetVaultDir, `${cat.id}.md`);
    if (!fs.existsSync(rootFilePath)) {
      const rootFm = {
        id: `root_${cat.id}`,
        title: cat.label,
        category: cat.id,
        isRoot: true,
        color: cat.color,
        description: cat.description,
        created: today,
        updated: today
      };
      const rootBody = `---
${yaml.stringify(rootFm).trim()}
---

# 🌟 ${cat.label}

${cat.description}.

> *This file represents the celestial core for all nodes within the \`${cat.id}\` category in the OKF 3D Galaxy.*
`;
      fs.writeFileSync(rootFilePath, rootBody, 'utf-8');
    }

    // 2. Create a starter sample node inside each category
    const starterFilePath = path.join(catDir, `welcome_to_${cat.id}.md`);
    if (!fs.existsSync(starterFilePath)) {
      const starterFm = {
        id: `welcome_${cat.id}`,
        title: `Welcome to ${cat.label}`,
        category: cat.id,
        tags: [cat.id, 'starter', 'welcome'],
        created: today,
        updated: today
      };
      const starterBody = `---
${yaml.stringify(starterFm).trim()}
---

# Welcome to ${cat.label}

This is your first starter node in the **${cat.label}** cluster.

## Connections & Relations
- Belongs to root cluster: [[${cat.id}]]
${categoriesToCreate.length > 1 ? `- Cross-link to related concepts: [[learnings]]` : ''}

## Context & Details
You can edit or replace this file. AI assistants (Claude Code, Google Antigravity) will read, search, and expand this vault automatically.
`;
      fs.writeFileSync(starterFilePath, starterBody, 'utf-8');
    }
  }

  // 3. Create Logs Directory if auto-learn is enabled
  if (answers.enableDailyLearning && answers.logsPath) {
    const logsDir = path.resolve(cwd, answers.logsPath);
    fs.mkdirSync(logsDir, { recursive: true });
    const sampleLogPath = path.join(logsDir, `${today}.md`);
    if (!fs.existsSync(sampleLogPath)) {
      const logContent = `# Daily Operational Log: ${today}

- Completed initial setup of ${answers.projectName} OKF Brain.
- Configured categories: ${categoriesToCreate.map(c => c.label).join(', ')}.
- Connected tools: ${answers.connectedApps.length > 0 ? answers.connectedApps.join(', ') : 'None'}.
`;
      fs.writeFileSync(sampleLogPath, logContent, 'utf-8');
    }
  }

  // 4. Save okf.config.json in project root
  const config: OKFConfig = {
    projectName: answers.projectName,
    vaultPath: answers.vaultPath,
    domain: answers.domain,
    categories: categoriesToCreate,
    connectedApps: answers.connectedApps,
    aiAssistants: answers.aiAssistants,
    autoLearn: {
      enabled: answers.enableDailyLearning,
      logsPath: answers.logsPath,
      schedule: '0 23 * * *' // 11 PM daily
    }
  };

  const configPath = path.join(cwd, 'okf.config.json');
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf-8');

  return config;
}
