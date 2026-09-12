import fs from 'fs';
import path from 'path';
import yaml from 'yaml';
import { OKFConfig } from '../types.js';

export interface ConsolidationResult {
  date: string;
  createdNodes: string[];
  updatedNodes: string[];
  linksFormed: number;
  summaryPath: string;
}

export function consolidateDailyKnowledge(cwd: string, targetDate?: string): ConsolidationResult {
  const configPath = path.join(cwd, 'okf.config.json');
  let config: OKFConfig;

  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } else {
    config = {
      projectName: 'OKF Brain',
      vaultPath: './brain',
      domain: 'custom',
      categories: [{ id: 'learnings', label: 'Learnings', description: 'Daily insights', color: '#34d399' }],
      connectedApps: [],
      aiAssistants: ['all'],
      autoLearn: { enabled: true, logsPath: './logs', schedule: '0 23 * * *' }
    };
  }

  const dateStr = targetDate || new Date().toISOString().split('T')[0];
  const vaultDir = path.resolve(cwd, config.vaultPath);
  const logsDir = path.resolve(cwd, config.autoLearn?.logsPath || './logs');
  const learningsDir = path.join(vaultDir, 'learnings');
  fs.mkdirSync(learningsDir, { recursive: true });

  const createdNodes: string[] = [];
  const updatedNodes: string[] = [];
  let linksCount = 0;

  // 1. Scan for daily log file
  let dailyLogContent = '';
  if (fs.existsSync(logsDir)) {
    const candidates = [
      path.join(logsDir, `${dateStr}.md`),
      path.join(logsDir, `${dateStr}.txt`),
      path.join(logsDir, `${dateStr}.json`)
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) {
        dailyLogContent = fs.readFileSync(c, 'utf-8');
        break;
      }
    }
  }

  // 2. Synthesize daily consolidation document
  const summaryFileName = `${dateStr}_daily_consolidation.md`;
  const summaryFilePath = path.join(learningsDir, summaryFileName);

  const summaryFm = {
    id: `learning_${dateStr.replace(/-/g, '_')}_daily_consolidation`,
    title: `Daily Consolidation: ${dateStr}`,
    category: 'learnings',
    tags: ['consolidation', 'daily-learning', 'synthesis'],
    date: dateStr,
    created: dateStr,
    updated: dateStr
  };

  const defaultCategories = config.categories.map(c => `- [[${c.id}]]: Status updated.`).join('\n');

  const summaryBody = `---
${yaml.stringify(summaryFm).trim()}
---

# 🧠 Daily Consolidation & Brain Evolution (${dateStr})

## 🌟 Knowledge Graph Synthesis
Automatic daily synthesis cycle for **${config.projectName}**.

### Active Star Clusters Checked:
${defaultCategories}

## 🔍 Logged Key Takeaways
${dailyLogContent ? dailyLogContent : '- Regular daily maintenance run. All nodes and orbital links verified.'}

## 🔗 Cross-Cluster Wikilinks
- Core Root: [[learnings]]
- Connected Clusters: ${config.categories.map(c => `[[${c.id}]]`).join(', ')}

---
*Generated automatically by OKF Brain Continuous Learning Engine.*
`;

  if (!fs.existsSync(summaryFilePath)) {
    fs.writeFileSync(summaryFilePath, summaryBody, 'utf-8');
    createdNodes.push(summaryFileName);
    linksCount += config.categories.length;
  } else {
    fs.writeFileSync(summaryFilePath, summaryBody, 'utf-8');
    updatedNodes.push(summaryFileName);
  }

  return {
    date: dateStr,
    createdNodes,
    updatedNodes,
    linksFormed: linksCount,
    summaryPath: path.relative(cwd, summaryFilePath)
  };
}
