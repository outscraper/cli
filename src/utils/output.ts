import fs from 'node:fs';
import path from 'node:path';

export function writeOutput(
  content: string,
  outputPath?: string,
  silent: boolean = false
): void {
  if (outputPath) {
    const dir = path.dirname(outputPath);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(outputPath, content, 'utf-8');
    if (!silent) {
      console.error(`Output written to: ${outputPath}`);
    }
    return;
  }

  if (!content.endsWith('\n')) {
    content += '\n';
  }

  process.stdout.write(content);
}

export function toPrettyJson(value: unknown, pretty = false): string {
  return pretty ? JSON.stringify(value, null, 2) : JSON.stringify(value);
}
