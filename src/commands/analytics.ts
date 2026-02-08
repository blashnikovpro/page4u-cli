import { Command } from 'commander';
import { requireConfig } from '../lib/config.js';
import { Page4UClient } from '../lib/api-client.js';
import { withErrorHandler } from '../lib/errors.js';
import { printJson, info, formatNumber } from '../lib/output.js';
import pc from 'picocolors';
import type { Analytics } from '../types.js';

export const analyticsCommand = new Command('analytics')
  .description('View analytics for a page')
  .argument('<slug>', 'Page slug')
  .option('--from <date>', 'Start date (YYYY-MM-DD)')
  .option('--to <date>', 'End date (YYYY-MM-DD)')
  .option('--json', 'Output as JSON')
  .action(
    withErrorHandler(async (slug: string, opts: { from?: string; to?: string; json?: boolean }) => {
      const config = requireConfig();
      const client = new Page4UClient(config.baseUrl, config.apiKey);

      const params = new URLSearchParams();
      if (opts.from) params.set('from', opts.from);
      if (opts.to) params.set('to', opts.to);

      const qs = params.toString();
      const path = `/pages/${encodeURIComponent(slug)}/analytics${qs ? `?${qs}` : ''}`;

      const { data } = await client.get<Analytics>(path);

      if (opts.json) {
        printJson(data);
        return;
      }

      const period = typeof data.period === 'string'
        ? data.period
        : `${data.period.from} to ${data.period.to}`;

      info(`Analytics for "${slug}" (${period})`);
      console.log();
      console.log(`  ${pc.bold('Total Events')}     ${formatNumber(data.totalEvents)}`);
      console.log(`  ${pc.bold('Page Views')}       ${formatNumber(data.page_view)}`);
      console.log(`  ${pc.bold('Button Clicks')}    ${formatNumber(data.button_click)}`);
      console.log(`  ${pc.bold('WhatsApp Clicks')}  ${formatNumber(data.whatsapp_click)}`);
      console.log(`  ${pc.bold('Phone Clicks')}     ${formatNumber(data.phone_click)}`);
      console.log(`  ${pc.bold('Email Clicks')}     ${formatNumber(data.email_click)}`);
      console.log(`  ${pc.bold('Form Submits')}     ${formatNumber(data.form_submit)}`);
    })
  );
