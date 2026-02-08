import { Command } from 'commander';
import { requireConfig } from '../lib/config.js';
import { Page4UClient } from '../lib/api-client.js';
import { withErrorHandler } from '../lib/errors.js';
import { printTable, printJson, info } from '../lib/output.js';
import type { Page } from '../types.js';

export const listCommand = new Command('list')
  .description('List your pages')
  .option('--status <status>', 'Filter by status (draft, published, archived)')
  .option('--json', 'Output as JSON')
  .action(
    withErrorHandler(async (opts: { status?: string; json?: boolean }) => {
      const config = requireConfig();
      const client = new Page4UClient(config.baseUrl, config.apiKey);

      let path = '/pages';
      if (opts.status) {
        path += `?status=${encodeURIComponent(opts.status)}`;
      }

      const { data, total } = await client.get<Page[]>(path);

      if (opts.json) {
        printJson({ data, total });
        return;
      }

      info(`${total ?? data.length} page(s) found`);

      printTable(
        ['Slug', 'Name', 'Status', 'Created'],
        data.map(p => [
          p.slug,
          p.businessName || '—',
          p.status,
          new Date(p.createdAt).toLocaleDateString(),
        ])
      );
    })
  );
