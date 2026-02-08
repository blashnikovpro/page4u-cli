import pc from 'picocolors';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const ERROR_HINTS: Record<string, string> = {
  UNAUTHORIZED: 'Run "page4u login" to authenticate.',
  RATE_LIMITED: 'Rate limit exceeded. Wait a moment and try again.',
  PLAN_REQUIRED: 'API access requires a premium or business plan.',
  PAGE_LIMIT: 'You have reached the page limit for your plan. Upgrade to create more.',
  SLUG_TAKEN: 'That slug is already in use. Try a different --name.',
  FILE_TOO_LARGE: 'File must be under 50MB.',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function withErrorHandler<T extends (...args: any[]) => Promise<void>>(fn: T): T {
  return (async (...args: unknown[]) => {
    try {
      await fn(...args);
    } catch (err) {
      if (err instanceof ApiError) {
        console.error(pc.red(`Error: ${err.message}`));
        const hint = ERROR_HINTS[err.code];
        if (hint) {
          console.error(pc.yellow(`Hint: ${hint}`));
        }
      } else if (err instanceof Error) {
        console.error(pc.red(`Error: ${err.message}`));
      } else {
        console.error(pc.red('An unexpected error occurred.'));
      }
      process.exit(1);
    }
  }) as unknown as T;
}
