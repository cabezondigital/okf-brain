import { Command } from 'commander';
import path from 'path';
import fs from 'fs';
import pc from 'picocolors';
import { runOnboardingWizard } from './cli/wizard.js';
import { scaffoldVault } from './core/scaffold.js';
import { generateAIHarnesses } from './core/harness.js';
import { consolidateDailyKnowledge } from './core/consolidator.js';
import { parseOKFVault } from './core/parser.js';
import { OKFConfig } from './types.js';

const program = new Command();

program
  .name('okf-brain')
  .description('Universal AI Knowledge Vault & Brain Framework (OKF v0.2 + 3D Galaxy Visualizer)')
  .version('1.0.0');

// Command: init
program
  .command('init')
  .description('Launch interactive onboarding assistant to scaffold an OKF brain in this workspace')
  .action(async () => {
    const cwd = process.cwd();
    try {
      const answers = await runOnboardingWizard(cwd);
      console.log('\n' + pc.cyan('⚡ Scaffolding knowledge vault and star clusters...'));
      const config = scaffoldVault(cwd, answers);

      console.log(pc.cyan('🤖 Generating AI harness instructions (CLAUDE.md, GEMINI.md, skills)...'));
      generateAIHarnesses(cwd, config);

      console.log('\n' + pc.green(pc.bold('✅ OKF BRAIN INITIALIZATION COMPLETE!')));
      console.log(pc.gray('---------------------------------------------------------------'));
      console.log(pc.white(`📁 Vault location:   ${pc.bold(config.vaultPath)}`));
      console.log(pc.white(`🌟 Star categories:  ${config.categories.map((c: any) => c.label).join(', ')}`));
      console.log(pc.white(`🤖 AI harnesses:     ${config.aiAssistants.join(', ')}`));
      console.log(pc.gray('---------------------------------------------------------------'));
      console.log(pc.yellow('\nNext steps:'));
      console.log(pc.white('  1. Launch 3D Galaxy Visualizer:  ') + pc.bold(pc.cyan('npx okf-brain viz')));
      console.log(pc.white('  2. Run Daily Consolidation:     ') + pc.bold(pc.cyan('npx okf-brain consolidate')));
      console.log(pc.white('  3. Open with Claude Code or Antigravity to begin pair-programming!\n'));
    } catch (err) {
      console.error(pc.red('\n❌ Initialization cancelled or failed:'), err);
      process.exit(1);
    }
  });

// Command: viz
program
  .command('viz')
  .description('Launch the real-time 3D Galaxy WebGL Visualizer')
  .option('-p, --port <number>', 'HTTP server port', '4000')
  .option('-v, --vault <path>', 'Custom path to OKF vault')
  .action((options) => {
    const cwd = process.cwd();
    console.log(pc.yellow('\n⚠️ The built-in visualizer has been deprecated.'));
    console.log(pc.white('Please use the standalone ') + pc.bold(pc.cyan('okf-galaxy-visualizer')) + pc.white(' repository instead.'));
    console.log(pc.white('It contains the latest WebGL optimizations and custom styling rules.\n'));
  });

// Command: consolidate
program
  .command('consolidate')
  .description('Run automated daily learning consolidation loop')
  .option('-d, --date <YYYY-MM-DD>', 'Target date to consolidate')
  .action((options) => {
    const cwd = process.cwd();
    console.log(pc.cyan('🧠 Running OKF Daily Knowledge Consolidation Engine...'));
    const result = consolidateDailyKnowledge(cwd, options.date);
    console.log(pc.green(`\n✅ Consolidation complete for date: ${pc.bold(result.date)}`));
    console.log(pc.white(`📄 Summary written to: ${pc.bold(result.summaryPath)}`));
    if (result.createdNodes.length > 0) {
      console.log(pc.green(`✨ New nodes created: ${result.createdNodes.join(', ')}`));
    }
    if (result.updatedNodes.length > 0) {
      console.log(pc.yellow(`🔄 Nodes updated: ${result.updatedNodes.join(', ')}`));
    }
    console.log(pc.cyan(`🔗 Orbital wikilinks resolved: ${result.linksFormed}\n`));
  });

// Command: lint
program
  .command('lint')
  .description('Lint and validate the integrity of the OKF vault')
  .option('-v, --vault <path>', 'Custom path to OKF vault')
  .action((options) => {
    const cwd = process.cwd();
    let vaultPath = options.vault;
    if (!vaultPath) {
      const configPath = path.join(cwd, 'okf.config.json');
      if (fs.existsSync(configPath)) {
        const config: OKFConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
        vaultPath = config.vaultPath;
      } else {
        vaultPath = './brain';
      }
    }

    const absPath = path.resolve(cwd, vaultPath);
    console.log(pc.cyan(`🔍 Linting OKF vault at ${absPath}...\n`));

    const { nodes, links } = parseOKFVault(absPath);
    console.log(pc.bold(pc.white('Graph Topology Summary:')));
    console.log(pc.gray('-------------------------------------'));
    console.log(`Total Nodes:       ${pc.green(nodes.length)}`);
    console.log(`Root Solar Cores:  ${pc.cyan(nodes.filter(n => n.isRoot).length)}`);
    console.log(`Total Links:       ${pc.magenta(links.length)}`);
    console.log(pc.gray('-------------------------------------\n'));

    // Check for missing frontmatter
    let warnings = 0;
    nodes.forEach(n => {
      if (!n.metadata || !n.metadata.id) {
        console.log(pc.yellow(`⚠️ Node "${n.label}" is missing an explicit id in YAML frontmatter`));
        warnings++;
      }
    });

    if (warnings === 0) {
      console.log(pc.green('🎉 All nodes and links comply with OKF v0.2 specification!\n'));
    } else {
      console.log(pc.yellow(`\nFound ${warnings} warning(s). Review guidelines in CLAUDE.md / GEMINI.md.\n`));
    }
  });

program.parse(process.argv);
