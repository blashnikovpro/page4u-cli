import { Command } from 'commander';
import * as readline from 'node:readline';
import { saveConfig, loadConfig } from '../lib/config.js';
import { Page4UClient } from '../lib/api-client.js';
import { withErrorHandler } from '../lib/errors.js';
import { success, info, warn } from '../lib/output.js';

const DEFAULT_BASE_URL = 'https://page4u.ai';

function promptInput(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });
}

export const loginCommand = new Command('login')
  .description('Authenticate with your Page4U API key')
  .option('--key <key>', 'API key (or enter interactively)')
  .option('--api-url <url>', 'API base URL (default: https://page4u.ai)')
  .action(
    withErrorHandler(async (opts: { key?: string; apiUrl?: string }) => {
      const existing = loadConfig();
      if (existing) {
        warn('You are already logged in. This will replace your existing credentials.');
      }

      let apiKey = opts.key;
      if (!apiKey) {
        if (!process.stdin.isTTY) {
          throw new Error('No API key provided. Use --key <key> in non-interactive mode.');
        }
        info('Get your API key at https://page4u.ai/dashboard/settings');
        apiKey = await promptInput('API key: ');
      }

      if (!apiKey || !apiKey.startsWith('p4u_')) {
        throw new Error('Invalid API key format. Keys start with "p4u_".');
      }

      const baseUrl = opts.apiUrl || DEFAULT_BASE_URL;

      // Validate the key by making a test request
      info('Validating API key...');
      const client = new Page4UClient(baseUrl, apiKey);
      await client.get('/pages');

      saveConfig({ apiKey, baseUrl });
      success('Logged in successfully! Config saved to ~/.page4u/config.json');
    })
  );
