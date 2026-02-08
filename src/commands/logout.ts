import { Command } from 'commander';
import { deleteConfig, getConfigPath } from '../lib/config.js';
import { withErrorHandler } from '../lib/errors.js';
import { success, info } from '../lib/output.js';

export const logoutCommand = new Command('logout')
  .description('Remove stored API credentials')
  .action(
    withErrorHandler(async () => {
      const deleted = deleteConfig();
      if (deleted) {
        success(`Credentials removed from ${getConfigPath()}`);
      } else {
        info('No credentials found. Already logged out.');
      }
    })
  );
