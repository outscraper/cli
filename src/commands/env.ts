import * as fs from 'node:fs';
import * as path from 'node:path';
import { ensureAuthenticated } from '../utils/auth.js';
import { getApiKey } from '../utils/config.js';

export interface EnvPullOptions {
  file?: string;
  overwrite?: boolean;
}

export async function handleEnvPullCommand(
  options: EnvPullOptions = {}
): Promise<void> {
  const apiKey = getApiKey() || (await ensureAuthenticated());
  const envFile = options.file || '.env';
  const envPath = path.resolve(process.cwd(), envFile);
  const envKey = 'OUTSCRAPER_API_KEY';
  const envLine = `${envKey}=${apiKey}`;

  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, `${envLine}\n`, 'utf-8');
    console.log(`Created ${envFile} with ${envKey}`);
    return;
  }

  const contents = fs.readFileSync(envPath, 'utf-8');
  const lines = contents.split(/\r?\n/);
  const existingIndex = lines.findIndex((line) => line.startsWith(`${envKey}=`));

  if (existingIndex !== -1) {
    if (!options.overwrite) {
      console.log(
        `${envKey} already exists in ${envFile}. Use --overwrite to replace it.`
      );
      return;
    }

    lines[existingIndex] = envLine;
    fs.writeFileSync(envPath, `${lines.join('\n').replace(/\n*$/, '\n')}`, 'utf-8');
    console.log(`Updated ${envKey} in ${envFile}`);
    return;
  }

  const separator = contents.endsWith('\n') ? '' : '\n';
  fs.appendFileSync(envPath, `${separator}${envLine}\n`, 'utf-8');
  console.log(`Added ${envKey} to ${envFile}`);
}
