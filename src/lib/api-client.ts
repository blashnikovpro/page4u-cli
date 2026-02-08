import { ApiError } from './errors.js';
import { warn } from './output.js';
import type { ApiResponse, RateLimitInfo } from '../types.js';

export class Page4UClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl: string, apiKey: string) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.apiKey = apiKey;
  }

  private checkRateLimit(headers: Headers): void {
    const remaining = headers.get('x-ratelimit-remaining');
    if (remaining !== null) {
      const n = parseInt(remaining, 10);
      if (!isNaN(n) && n < 5) {
        warn(`Rate limit: ${n} requests remaining.`);
      }
    }
  }

  getRateLimitInfo(headers: Headers): RateLimitInfo | null {
    const limit = headers.get('x-ratelimit-limit');
    const remaining = headers.get('x-ratelimit-remaining');
    const reset = headers.get('x-ratelimit-reset');
    if (limit === null || remaining === null || reset === null) return null;
    return {
      limit: parseInt(limit, 10),
      remaining: parseInt(remaining, 10),
      reset: parseInt(reset, 10),
    };
  }

  async request<T>(
    method: string,
    path: string,
    body?: Record<string, unknown> | FormData
  ): Promise<{ data: T; total?: number; headers: Headers }> {
    const url = `${this.baseUrl}/api/v1${path}`;

    const headers: Record<string, string> = {
      Authorization: `Bearer ${this.apiKey}`,
    };

    let fetchBody: string | FormData | undefined;

    if (body instanceof FormData) {
      fetchBody = body;
      // Don't set Content-Type; fetch sets it with boundary for FormData
    } else if (body) {
      headers['Content-Type'] = 'application/json';
      fetchBody = JSON.stringify(body);
    }

    let res: Response;
    try {
      res = await fetch(url, { method, headers, body: fetchBody });
    } catch (err) {
      throw new Error(
        `Could not connect to ${this.baseUrl}. Check your internet connection or API URL.`
      );
    }

    this.checkRateLimit(res.headers);

    const json = (await res.json()) as ApiResponse<T>;

    if (!json.success) {
      throw new ApiError(
        json.error.code,
        json.error.message,
        res.status
      );
    }

    return { data: json.data, total: json.total, headers: res.headers };
  }

  async get<T>(path: string): Promise<{ data: T; total?: number; headers: Headers }> {
    return this.request<T>('GET', path);
  }

  async post<T>(
    path: string,
    body: Record<string, unknown> | FormData
  ): Promise<{ data: T; total?: number; headers: Headers }> {
    return this.request<T>('POST', path, body);
  }

  async put<T>(
    path: string,
    body: Record<string, unknown> | FormData
  ): Promise<{ data: T; total?: number; headers: Headers }> {
    return this.request<T>('PUT', path, body);
  }

  async delete<T>(path: string): Promise<{ data: T; headers: Headers }> {
    return this.request<T>('DELETE', path);
  }
}
