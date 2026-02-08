import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import type { CliConfig } from '../types.js';

const CONFIG_DIR = path.join(os.homedir(), '.page4u');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');
const DEFAULT_BASE_URL = 'https://page4u.ai';

export function getConfigPath(): string {
  return CONFIG_FILE;
}

export function loadConfig(): CliConfig | null {
  // Env vars take precedence
  const envKey = process.env.PAGE4U_API_KEY;
  const envUrl = process.env.PAGE4U_API_URL;

  if (envKey) {
    return {
      apiKey: envKey,
      baseUrl: envUrl || DEFAULT_BASE_URL,
    };
  }

  if (!fs.existsSync(CONFIG_FILE)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf-8');
    const parsed = JSON.parse(raw) as Partial<CliConfig>;
    if (!parsed.apiKey) return null;
    return {
      apiKey: parsed.apiKey,
      baseUrl: envUrl || parsed.baseUrl || DEFAULT_BASE_URL,
    };
  } catch {
    return null;
  }
}

export function requireConfig(): CliConfig {
  const config = loadConfig();
  if (!config) {
    throw new Error(
      'Not authenticated. Run "page4u login" to get started.'
    );
  }
  return config;
}

export function saveConfig(config: CliConfig): void {
  if (!fs.existsSync(CONFIG_DIR)) {
    fs.mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
  }
  fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + '\n', {
    mode: 0o600,
  });
}

export function deleteConfig(): boolean {
  if (fs.existsSync(CONFIG_FILE)) {
    fs.unlinkSync(CONFIG_FILE);
    return true;
  }
  return false;
}
