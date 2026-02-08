import { Command } from 'commander';
import { loadConfig } from '../lib/config.js';
import { Page4UClient } from '../lib/api-client.js';
import { withErrorHandler } from '../lib/errors.js';
import { success, info, error } from '../lib/output.js';

export const whoamiCommand = new Command('whoami')
  .description('Show current authentication status')
  .action(
    withErrorHandler(async () => {
      const config = loadConfig();

      if (!config) {
        info('Not logged in. Run "page4u login" to authenticate.');
        return;
      }

      const keyPrefix = config.apiKey.substring(0, 12) + '...';
      info(`API key: ${keyPrefix}`);
      info(`API URL: ${config.baseUrl}`);

      // Verify the key still works
      try {
        const client = new Page4UClient(config.baseUrl, config.apiKey);
        await client.get('/pages');
        success('API key is valid.');
      } catch {
        error('API key is invalid or expired. Run "page4u login" to re-authenticate.');
      }
    })
  );
