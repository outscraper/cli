import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { select } from '@inquirer/prompts';
import type { InitOptions } from '../init.js';

const AVAILABLE_TEMPLATES = ['businesses-basic', 'businesses-csv'];

function getTemplateRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../templates');
}

function copyDirectory(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

export async function runInitTemplatesStep(options: InitOptions): Promise<void> {
  let template = options.template;

  if (!template && !options.yes) {
    template = await select({
      message: 'Choose a starter template',
      choices: [
        { name: 'businesses-basic', value: 'businesses-basic' },
        { name: 'businesses-csv', value: 'businesses-csv' },
        { name: 'skip', value: 'skip' },
      ],
    });
  }

  if (!template || template === 'skip') {
    return;
  }

  if (!AVAILABLE_TEMPLATES.includes(template)) {
    throw new Error(`Unknown template: ${template}`);
  }

  const sourceDir = path.join(getTemplateRoot(), template);
  const targetDir = path.join(process.cwd(), template);

  if (fs.existsSync(targetDir) && fs.readdirSync(targetDir).length > 0) {
    console.log(`Template target already exists: ${targetDir}`);
    return;
  }

  copyDirectory(sourceDir, targetDir);
  console.log(`Scaffolded template in ${targetDir}\n`);
}
