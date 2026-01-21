# primrose-mcp

Primrose SDK for MCP tool integration. Connect to MCP servers and get tool definitions formatted for your LLM provider.

## Installation

```bash
npm install primrose-mcp
# or
pnpm add primrose-mcp
# or
yarn add primrose-mcp
```

## Usage

```typescript
import { Primrose } from 'primrose-mcp';

// Initialize with your API key and provider
const primrose = new Primrose({
  apiKey: 'prm_xxxxx',
  provider: 'anthropic' // or 'openai', 'google', 'amazon', 'meta', 'mistral', 'generic'
});

// List all available tools
const tools = await primrose.listTools();

// List tools from a specific MCP server
const hubspotTools = await primrose.listTools({ mcpServer: 'hubspot' });

// Search for tools
const searchResults = await primrose.searchTools('create contact');

// Call a tool
const result = await primrose.callTool('hubspot_create_contact', {
  email: 'user@example.com',
  firstName: 'John',
  lastName: 'Doe'
});
```

## Supported Providers

The SDK formats tool definitions for each LLM provider:

| Provider | Format |
|----------|--------|
| `anthropic` | `{ name, description, input_schema }` |
| `openai` | `{ type: 'function', function: { name, description, parameters } }` |
| `google` | `{ name, description, parameters }` with uppercase types |
| `amazon` | `{ toolSpec: { name, description, inputSchema: { json } } }` |
| `meta` | Same as OpenAI format |
| `mistral` | Same as OpenAI format |
| `generic` | `{ name, description, parameters }` |

## Configuration

```typescript
interface PrimroseConfig {
  apiKey: string;       // Required: Your Primrose API key
  provider?: Provider;  // Optional: LLM provider (default: 'generic')
  baseUrl?: string;     // Optional: API base URL (default: 'https://api.primrose.dev')
}
```

## Error Handling

The SDK throws `PrimroseError` for API errors:

```typescript
import { Primrose, PrimroseError } from 'primrose-mcp';

try {
  await primrose.callTool('some_tool', {});
} catch (error) {
  if (error instanceof PrimroseError) {
    console.log(error.code);    // 'UNAUTHORIZED', 'NOT_FOUND', etc.
    console.log(error.message); // Error message from API
    console.log(error.status);  // HTTP status code
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Invalid API key |
| `PAYMENT_REQUIRED` | 402 | Subscription expired |
| `FORBIDDEN` | 403 | Access denied |
| `NOT_FOUND` | 404 | Tool not found |
| `INTERNAL_ERROR` | 500 | Server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## License

MIT
