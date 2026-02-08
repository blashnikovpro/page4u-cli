#!/usr/bin/env node
import { Command } from 'commander';
import { loginCommand } from './commands/login.js';
import { logoutCommand } from './commands/logout.js';
import { whoamiCommand } from './commands/whoami.js';
import { deployCommand } from './commands/deploy.js';
import { listCommand } from './commands/list.js';
import { leadsCommand } from './commands/leads.js';
import { analyticsCommand } from './commands/analytics.js';
import { deleteCommand } from './commands/delete.js';

const program = new Command();

program
  .name('page4u')
  .description('CLI for the Page4U API')
  .version('1.0.0');

program.addCommand(loginCommand);
program.addCommand(logoutCommand);
program.addCommand(whoamiCommand);
program.addCommand(deployCommand);
program.addCommand(listCommand);
program.addCommand(leadsCommand);
program.addCommand(analyticsCommand);
program.addCommand(deleteCommand);

program.parse();
