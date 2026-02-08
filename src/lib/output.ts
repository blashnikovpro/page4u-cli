import pc from 'picocolors';

export function success(msg: string): void {
  console.log(pc.green(`✓ ${msg}`));
}

export function error(msg: string): void {
  console.error(pc.red(`✗ ${msg}`));
}

export function warn(msg: string): void {
  console.warn(pc.yellow(`⚠ ${msg}`));
}

export function info(msg: string): void {
  console.log(pc.cyan(`ℹ ${msg}`));
}

export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

export function printTable(headers: string[], rows: string[][]): void {
  if (rows.length === 0) {
    info('No results found.');
    return;
  }

  // Calculate column widths
  const widths = headers.map((h, i) => {
    const maxRow = rows.reduce((max, row) => Math.max(max, (row[i] || '').length), 0);
    return Math.max(h.length, maxRow);
  });

  // Header
  const headerLine = headers.map((h, i) => h.padEnd(widths[i])).join('  ');
  const separator = widths.map(w => '─'.repeat(w)).join('──');

  console.log(pc.bold(headerLine));
  console.log(pc.dim(separator));

  // Rows
  for (const row of rows) {
    const line = row.map((cell, i) => (cell || '').padEnd(widths[i])).join('  ');
    console.log(line);
  }
}

const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

export function spinner(msg: string): { stop: (finalMsg?: string) => void } {
  let i = 0;
  const isTTY = process.stderr.isTTY;

  if (!isTTY) {
    process.stderr.write(`${msg}...\n`);
    return { stop: (finalMsg?: string) => { if (finalMsg) console.log(finalMsg); } };
  }

  const interval = setInterval(() => {
    process.stderr.write(`\r${pc.cyan(SPINNER_FRAMES[i % SPINNER_FRAMES.length])} ${msg}`);
    i++;
  }, 80);

  return {
    stop(finalMsg?: string) {
      clearInterval(interval);
      process.stderr.write('\r' + ' '.repeat(msg.length + 4) + '\r');
      if (finalMsg) console.log(finalMsg);
    },
  };
}

export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}
