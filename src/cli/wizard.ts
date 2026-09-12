import readline from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import pc from 'picocolors';
import { OnboardingAnswers } from '../types.js';

export async function runOnboardingWizard(cwd: string): Promise<OnboardingAnswers> {
  const rl = readline.createInterface({ input, output });

  console.log('\n' + pc.cyan('==============================================================='));
  console.log(pc.bold(pc.cyan('       🌌 WELCOME TO OKF BRAIN - SYSTEM ONBOARDING WIZARD')));
  console.log(pc.cyan('==============================================================='));
  console.log(pc.gray(' Scaffold a self-learning Open Knowledge Format (OKF v0.2) vault'));
  console.log(pc.gray(' with 3D Galaxy WebGL Visualizer, Claude Code, and Antigravity.\n'));

  try {
    // 1. Project Name
    const defaultName = 'My OKF Brain';
    const projectNameAns = await rl.question(
      pc.bold('1. Project / Assistant Name ') + pc.gray(`[${defaultName}]: `)
    );
    const projectName = projectNameAns.trim() || defaultName;

    // 2. Vault Path
    const defaultVault = './brain';
    const vaultPathAns = await rl.question(
      pc.bold('2. Where should the knowledge vault live? ') + pc.gray(`[${defaultVault}]: `)
    );
    const vaultPath = vaultPathAns.trim() || defaultVault;

    // 3. Language Preference
    console.log('\n' + pc.bold('3. Select Preferred Language for Notes & AI Interaction:'));
    console.log(pc.cyan('   [1] English (en)'));
    console.log(pc.cyan('   [2] Español (es)'));
    console.log(pc.cyan('   [3] Français (fr)'));
    console.log(pc.cyan('   [4] Deutsch (de)'));
    console.log(pc.cyan('   [5] Italiano (it)'));
    console.log(pc.cyan('   [6] Other / Custom'));

    const langChoice = await rl.question(pc.bold('   Select language (1-6) ') + pc.gray('[1]: '));
    const langMap: Record<string, string> = {
      '1': 'en',
      '2': 'es',
      '3': 'fr',
      '4': 'de',
      '5': 'it'
    };
    let language = langMap[langChoice.trim()] || 'en';
    if (langChoice.trim() === '6') {
      const customLang = await rl.question(pc.bold('   Enter language code or name (e.g. pt, ja): '));
      language = customLang.trim() || 'en';
    }

    // 4. Domain & Scope
    console.log('\n' + pc.bold('4. Select Project Domain & Information Focus:'));
    console.log(pc.cyan('   [1] Personal AI Assistant / Chief of Staff ') + pc.gray('(Contacts, Events, Learnings, Projects)'));
    console.log(pc.cyan('   [2] Software Engineering & System Architecture ') + pc.gray('(Architecture, ADR Decisions, Specs, Postmortems)'));
    console.log(pc.cyan('   [3] Startup Operations & Business Intelligence ') + pc.gray('(Clients, Deals, Strategy, Meetings)'));
    console.log(pc.cyan('   [4] Academic Research & Science ') + pc.gray('(Papers, Hypotheses, Experiments, Findings)'));
    console.log(pc.cyan('   [5] Custom / Minimalist '));

    const domainChoice = await rl.question(pc.bold('   Select option (1-5) ') + pc.gray('[1]: '));
    const domainMap: Record<string, 'assistant' | 'software' | 'business' | 'research' | 'custom'> = {
      '1': 'assistant',
      '2': 'software',
      '3': 'business',
      '4': 'research',
      '5': 'custom'
    };
    const domain = domainMap[domainChoice.trim()] || 'assistant';

    // 4. Connected Applications
    console.log('\n' + pc.bold('5. Connected Applications & Data Sources:'));
    console.log(pc.gray('   Will this brain connect to external channels? (comma-separated, e.g. whatsapp, slack, github)'));
    const appsAns = await rl.question(pc.bold('   Connected apps ') + pc.gray('[whatsapp, github]: '));
    const connectedApps = (appsAns.trim() || 'whatsapp, github')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    // 5. Target AI Assistants
    console.log('\n' + pc.bold('6. Target AI Assistants to Configure:'));
    console.log(pc.cyan('   [1] Universal (Claude Code + Google Antigravity/Gemini + Cursor)'));
    console.log(pc.cyan('   [2] Claude Code only (CLAUDE.md)'));
    console.log(pc.cyan('   [3] Google Antigravity only (GEMINI.md + skill)'));

    const aiChoice = await rl.question(pc.bold('   Select option (1-3) ') + pc.gray('[1]: '));
    let aiAssistants = ['all'];
    if (aiChoice.trim() === '2') aiAssistants = ['claude'];
    if (aiChoice.trim() === '3') aiAssistants = ['antigravity'];

    // 6. Daily Auto-Learning
    console.log('\n' + pc.bold('7. Automated Daily Learning & Consolidation Loop:'));
    const autoLearnAns = await rl.question(
      pc.bold('   Enable automatic daily synthesis & cluster organization? (Y/n) ') + pc.gray('[Y]: ')
    );
    const enableDailyLearning = autoLearnAns.trim().toLowerCase() !== 'n';

    let logsPath = './storage/logs';
    if (enableDailyLearning) {
      const logsAns = await rl.question(
        pc.bold('   Path for raw daily logs/conversation history ') + pc.gray(`[${logsPath}]: `)
      );
      logsPath = logsAns.trim() || logsPath;
    }

    rl.close();

    return {
      projectName,
      vaultPath,
      language,
      domain,
      categories: [],
      connectedApps,
      aiAssistants,
      enableDailyLearning,
      logsPath
    };
  } catch (err) {
    rl.close();
    throw err;
  }
}
