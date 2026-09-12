import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { OnboardingAnswers, OKFConfig } from '../types.js';

export const DOMAIN_PRESETS_EN: Record<string, { categories: Array<{ id: string; label: string; description: string; color: string }> }> = {
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

export const DOMAIN_PRESETS_ES: Record<string, { categories: Array<{ id: string; label: string; description: string; color: string }> }> = {
  assistant: {
    categories: [
      { id: 'contactos', label: 'Contactos y VIPs', description: 'Perfiles, relaciones y notas de interacción', color: '#38bdf8' },
      { id: 'eventos', label: 'Eventos y Citas', description: 'Galas, conferencias, reuniones y eventos de agenda', color: '#a855f7' },
      { id: 'aprendizajes', label: 'Aprendizajes y Conocimiento', description: 'Perspectivas y descubrimientos consolidados a diario', color: '#34d399' },
      { id: 'proyectos', label: 'Proyectos e Iniciativas', description: 'Iniciativas activas, hojas de ruta e hitos', color: '#6366f1' },
      { id: 'preferencias', label: 'Preferencias y Estilo de Vida', description: 'Hábitos dietéticos, viajes, lujo y estilo de vida', color: '#f43f5e' }
    ]
  },
  software: {
    categories: [
      { id: 'arquitectura', label: 'Arquitectura del Sistema', description: 'Topologías principales, subsistemas y flujos de datos', color: '#f59e0b' },
      { id: 'decisiones', label: 'Decisiones de Arquitectura (ADRs)', description: 'Registro inmutable de decisiones técnicas y diseño', color: '#ec4899' },
      { id: 'especificaciones', label: 'Especificaciones y APIs', description: 'Requisitos de producto y contratos de API', color: '#10b981' },
      { id: 'dependencias', label: 'Dependencias y Stack', description: 'Librerías, versiones y servicios de terceros', color: '#06b6d4' },
      { id: 'aprendizajes', label: 'Postmortems y Aprendizajes', description: 'Investigación de incidencias y lecciones aprendidas', color: '#34d399' }
    ]
  },
  business: {
    categories: [
      { id: 'clientes', label: 'Clientes y Cuentas', description: 'Cuentas clave de clientes y organigramas', color: '#38bdf8' },
      { id: 'negociaciones', label: 'Negociaciones y Pipeline', description: 'Oportunidades comerciales y etapas contractuales', color: '#f97316' },
      { id: 'estrategia', label: 'Estrategia y OKRs', description: 'Objetivos de negocio y posicionamiento en el mercado', color: '#a855f7' },
      { id: 'operaciones', label: 'Operaciones y Manuales', description: 'Procedimientos operativos estándar y playbooks', color: '#6366f1' },
      { id: 'reuniones', label: 'Reuniones Directivas', description: 'Reuniones de consejo, syncs y resúmenes estratégicos', color: '#10b981' }
    ]
  },
  research: {
    categories: [
      { id: 'articulos', label: 'Literatura y Papers', description: 'Publicaciones académicas, resúmenes y bibliografía', color: '#6366f1' },
      { id: 'hipotesis', label: 'Hipótesis y Preguntas', description: 'Proposiciones científicas y supuestos centrales', color: '#ec4899' },
      { id: 'experimentos', label: 'Experimentos y Benchmarks', description: 'Metodologías, entornos de prueba y ejecuciones', color: '#f59e0b' },
      { id: 'hallazgos', label: 'Hallazgos y Conclusiones', description: 'Resultados empíricos, métricas y evidencias verificadas', color: '#34d399' }
    ]
  },
  custom: {
    categories: [
      { id: 'conceptos', label: 'Conceptos Clave', description: 'Pilares fundamentales del conocimiento', color: '#38bdf8' },
      { id: 'notas', label: 'Notas e Ideas', description: 'Reflexiones y entradas en bruto', color: '#a855f7' },
      { id: 'aprendizajes', label: 'Aprendizajes', description: 'Perspectivas verificadas y síntesis diaria', color: '#34d399' }
    ]
  }
};

export const DOMAIN_PRESETS = DOMAIN_PRESETS_EN;

export function scaffoldVault(cwd: string, answers: OnboardingAnswers): OKFConfig {
  const targetVaultDir = path.resolve(cwd, answers.vaultPath);
  fs.mkdirSync(targetVaultDir, { recursive: true });

  const isSpanish = (answers.language || '').toLowerCase().startsWith('es');
  const presetsMap = isSpanish ? DOMAIN_PRESETS_ES : DOMAIN_PRESETS_EN;
  const domainPreset = presetsMap[answers.domain] || presetsMap.custom;
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
    language: answers.language || 'en',
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
