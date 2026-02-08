import fs from 'node:fs';
import path from 'node:path';
import AdmZip from 'adm-zip';

const IGNORED = new Set(['.DS_Store', 'Thumbs.db', '.git', 'node_modules']);

function addDirToZip(zip: AdmZip, dirPath: string, zipPath: string): void {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  for (const entry of entries) {
    if (IGNORED.has(entry.name)) continue;

    const fullPath = path.join(dirPath, entry.name);
    const entryZipPath = zipPath ? `${zipPath}/${entry.name}` : entry.name;

    if (entry.isDirectory()) {
      addDirToZip(zip, fullPath, entryZipPath);
    } else if (entry.isFile()) {
      zip.addLocalFile(fullPath, zipPath || undefined);
    }
  }
}

export function zipDirectory(dirPath: string): Buffer {
  const zip = new AdmZip();
  addDirToZip(zip, dirPath, '');
  return zip.toBuffer();
}
