export function formatCliError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return 'Unknown error';
}

export function handleCliError(error: unknown): never {
  console.error(`Error: ${formatCliError(error)}`);
  process.exit(1);
}
