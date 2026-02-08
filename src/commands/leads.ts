import { Command } from 'commander';
import { requireConfig } from '../lib/config.js';
import { Page4UClient } from '../lib/api-client.js';
import { withErrorHandler } from '../lib/errors.js';
import { printTable, printJson, info } from '../lib/output.js';
import type { Lead } from '../types.js';

export const leadsCommand = new Command('leads')
  .description('View leads for a page')
  .argument('<slug>', 'Page slug')
  .option('--status <status>', 'Filter by lead status')
  .option('--limit <n>', 'Max results (default: 50)', '50')
  .option('--json', 'Output as JSON')
  .action(
    withErrorHandler(async (slug: string, opts: { status?: string; limit: string; json?: boolean }) => {
      const config = requireConfig();
      const client = new Page4UClient(config.baseUrl, config.apiKey);

      const params = new URLSearchParams();
      if (opts.status) params.set('status', opts.status);
      params.set('limit', opts.limit);

      const qs = params.toString();
      const path = `/pages/${encodeURIComponent(slug)}/leads${qs ? `?${qs}` : ''}`;

      const { data, total } = await client.get<Lead[]>(path);

      if (opts.json) {
        printJson({ data, total });
        return;
      }

      info(`${total ?? data.length} lead(s) for "${slug}"`);

      printTable(
        ['Name', 'Phone', 'Email', 'Status', 'Date'],
        data.map(l => [
          l.name || '—',
          l.phone || '—',
          l.email || '—',
          l.status,
          new Date(l.createdAt).toLocaleDateString(),
        ])
      );
    })
  );
