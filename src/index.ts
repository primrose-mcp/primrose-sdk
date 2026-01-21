import { PrimroseError } from './errors.js';
import { formatForProvider } from './providers/index.js';
import type {
  Provider,
  PrimroseConfig,
  ListToolsOptions,
  ToolDefinition,
  FormattedTool,
  ToolsResponse
} from './types.js';

const VALID_PROVIDERS: Provider[] = ['anthropic', 'openai', 'google', 'amazon', 'meta', 'mistral', 'generic'];

const STATUS_CODE_MAP: Record<number, string> = {
  401: 'UNAUTHORIZED',
  402: 'PAYMENT_REQUIRED',
  403: 'FORBIDDEN',
  404: 'NOT_FOUND',
  500: 'INTERNAL_ERROR',
  503: 'SERVICE_UNAVAILABLE'
};

export class Primrose {
  private readonly apiKey: string;
  private readonly provider: Provider;
  private readonly baseUrl: string;

  constructor(config: PrimroseConfig) {
    if (!config.apiKey || config.apiKey === '') {
      throw new Error('apiKey is required');
    }

    if (config.provider && !VALID_PROVIDERS.includes(config.provider)) {
      throw new Error(`Invalid provider: ${config.provider}. Must be one of: ${VALID_PROVIDERS.join(', ')}`);
    }

    this.apiKey = config.apiKey;
    this.provider = config.provider ?? 'generic';
    this.baseUrl = config.baseUrl ?? 'https://api.primrose.dev';
  }

  async listTools(options?: ListToolsOptions): Promise<FormattedTool[]> {
    const params = new URLSearchParams({
      provider: this.provider
    });

    if (options?.mcpServer) {
      params.set('mcp_server', options.mcpServer);
    }

    const response = await this.request<ToolsResponse>(`/tools?${params.toString()}`);

    return response.tools.map(tool => formatForProvider(tool, this.provider));
  }

  async searchTools(query: string): Promise<FormattedTool[]> {
    const params = new URLSearchParams({
      q: query,
      provider: this.provider
    });

    const response = await this.request<ToolsResponse>(`/tools/search?${params.toString()}`);

    return response.tools.map(tool => formatForProvider(tool, this.provider));
  }

  async callTool<T = unknown>(
    toolName: string,
    params: Record<string, unknown>
  ): Promise<{ result: T }> {
    const response = await this.request<{ result: T }>('/tools/call', {
      method: 'POST',
      body: JSON.stringify({
        tool: toolName,
        params
      })
    });

    return response;
  }

  private async request<T>(path: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path}`;

    const response = await fetch(url, {
      ...options,
      method: options.method ?? 'GET',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    });

    const data = await response.json() as Record<string, unknown>;

    if (!response.ok) {
      const code = STATUS_CODE_MAP[response.status] ?? 'UNKNOWN_ERROR';
      const message = (data.message as string) ?? (data.error as string) ?? 'An error occurred';

      throw new PrimroseError(message, code, response.status);
    }

    return data as T;
  }
}

export { PrimroseError } from './errors.js';
export * from './types.js';
export { formatForProvider } from './providers/index.js';
