import { Command } from 'commander';
import * as readline from 'node:readline';
import { requireConfig } from '../lib/config.js';
import { Page4UClient } from '../lib/api-client.js';
import { withErrorHandler } from '../lib/errors.js';
import { success, warn } from '../lib/output.js';

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stderr,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

export const deleteCommand = new Command('delete')
  .description('Delete a page')
  .argument('<slug>', 'Page slug to delete')
  .option('--force', 'Skip confirmation prompt')
  .action(
    withErrorHandler(async (slug: string, opts: { force?: boolean }) => {
      const config = requireConfig();

      if (!opts.force) {
        if (!process.stdin.isTTY) {
          throw new Error('Cannot confirm deletion in non-interactive mode. Use --force to skip.');
        }
        const yes = await confirm(`Delete page "${slug}"? This cannot be undone. (y/N) `);
        if (!yes) {
          warn('Cancelled.');
          return;
        }
      }

      const client = new Page4UClient(config.baseUrl, config.apiKey);
      await client.delete(`/pages/${encodeURIComponent(slug)}`);

      success(`Page "${slug}" deleted.`);
    })
  );
