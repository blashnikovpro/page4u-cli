import { Command } from 'commander';
import fs from 'node:fs';
import path from 'node:path';
import { requireConfig } from '../lib/config.js';
import { Page4UClient } from '../lib/api-client.js';
import { withErrorHandler } from '../lib/errors.js';
import { success, warn, spinner } from '../lib/output.js';
import { zipDirectory } from '../lib/zip.js';
import type { DeployResult } from '../types.js';

const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export const deployCommand = new Command('deploy')
  .description('Deploy an HTML file or directory as a page')
  .argument('<path>', 'Path to HTML file or directory')
  .option('--name <slug>', 'Page URL slug')
  .option('--locale <locale>', 'Page locale (he or en)', 'he')
  .option('--whatsapp <phone>', 'WhatsApp number for contact form')
  .action(
    withErrorHandler(async (filePath: string, opts: { name?: string; locale: string; whatsapp?: string }) => {
      const config = requireConfig();
      const resolved = path.resolve(filePath);

      if (!fs.existsSync(resolved)) {
        throw new Error(`Path not found: ${resolved}`);
      }

      const stat = fs.statSync(resolved);
      let fileBuffer: Buffer;
      let fileName: string;

      if (stat.isDirectory()) {
        // Check that directory contains an HTML file
        const entries = fs.readdirSync(resolved);
        const hasHtml = entries.some(e => e.endsWith('.html'));
        if (!hasHtml) {
          throw new Error('Directory must contain at least one .html file.');
        }

        const spin = spinner('Creating ZIP from directory');
        fileBuffer = zipDirectory(resolved);
        fileName = 'site.zip';
        spin.stop();
      } else {
        if (!resolved.endsWith('.html') && !resolved.endsWith('.zip')) {
          warn('File does not have .html or .zip extension. Proceeding anyway.');
        }
        fileBuffer = fs.readFileSync(resolved);
        fileName = path.basename(resolved);
      }

      if (fileBuffer.length > MAX_SIZE) {
        throw new Error(`File is ${(fileBuffer.length / 1024 / 1024).toFixed(1)}MB. Maximum is 50MB.`);
      }

      const formData = new FormData();
      formData.append('file', new Blob([new Uint8Array(fileBuffer)]), fileName);

      if (opts.name) formData.append('slug', opts.name);
      if (opts.locale) formData.append('locale', opts.locale);
      if (opts.whatsapp) formData.append('whatsapp', opts.whatsapp);

      const spin = spinner('Deploying');
      const { data } = await new Page4UClient(config.baseUrl, config.apiKey)
        .post<DeployResult>('/pages', formData);
      spin.stop();

      success(`Page deployed!`);
      console.log(`  URL:  ${data.url}`);
      console.log(`  Slug: ${data.slug}`);
      if (data.businessName) {
        console.log(`  Name: ${data.businessName}`);
      }
      if (data.warnings?.length) {
        for (const w of data.warnings) {
          warn(w);
        }
      }
    })
  );
