# Primrose SDK Test Coverage Plan

This document outlines the test coverage plan for the `primrose-mcp` SDK.

## Test Files

### `errors.test.ts`
Tests for the `PrimroseError` class.

| Test | Description | Status |
|------|-------------|--------|
| PrimroseError extends Error | Verify inheritance | ⏳ |
| name property | Should be 'PrimroseError' | ⏳ |
| code property | Custom error code | ⏳ |
| message property | Error message | ⏳ |
| optional status property | HTTP status code | ⏳ |
| caught as Error | Error handling compatibility | ⏳ |
| instanceof works | Type checking | ⏳ |

### `providers.test.ts`
Tests for provider-specific schema formatters.

| Provider | Format Structure | Types | Status |
|----------|------------------|-------|--------|
| Anthropic | `{ name, description, input_schema }` | lowercase | ⏳ |
| OpenAI | `{ type: 'function', function: { name, description, parameters } }` | lowercase | ⏳ |
| Google | `{ name, description, parameters }` | UPPERCASE | ⏳ |
| Amazon | `{ toolSpec: { name, description, inputSchema: { json } } }` | lowercase | ⏳ |
| Meta | Same as OpenAI | lowercase | ⏳ |
| Mistral | Same as OpenAI | lowercase | ⏳ |
| Generic | `{ name, description, parameters }` | lowercase | ⏳ |

### `primrose.test.ts`
Tests for the main `Primrose` class.

#### Constructor Tests
| Test | Description | Status |
|------|-------------|--------|
| accepts apiKey and provider | Basic initialization | ⏳ |
| throws on missing apiKey | Validation | ⏳ |
| throws on empty apiKey | Validation | ⏳ |
| defaults provider to 'generic' | Default behavior | ⏳ |
| accepts baseUrl override | Configuration | ⏳ |
| defaults baseUrl | Default behavior | ⏳ |
| accepts valid providers | All 7 providers | ⏳ |
| throws on invalid provider | Validation | ⏳ |

#### listTools() Tests
| Test | Description | Status |
|------|-------------|--------|
| returns array of tools | Success response | ⏳ |
| calls GET /tools | HTTP method & endpoint | ⏳ |
| sends Authorization header | Authentication | ⏳ |
| passes provider param | Query parameter | ⏳ |
| accepts mcpServer filter | Optional filter | ⏳ |
| passes mcp_server param | Query parameter | ⏳ |
| returns empty array | Empty response | ⏳ |
| throws on 401 | Error handling | ⏳ |
| throws on 500 | Error handling | ⏳ |

#### searchTools() Tests
| Test | Description | Status |
|------|-------------|--------|
| returns matching tools | Success response | ⏳ |
| calls GET /tools/search | HTTP method & endpoint | ⏳ |
| passes q param | Query parameter | ⏳ |
| passes provider param | Query parameter | ⏳ |
| returns empty array | No matches | ⏳ |
| throws on error | Error handling | ⏳ |

#### callTool() Tests
| Test | Description | Status |
|------|-------------|--------|
| returns result | Success response | ⏳ |
| calls POST /tools/call | HTTP method & endpoint | ⏳ |
| sends tool and params | Request body | ⏳ |
| throws UNAUTHORIZED on 401 | Error code mapping | ⏳ |
| throws PAYMENT_REQUIRED on 402 | Error code mapping | ⏳ |
| throws FORBIDDEN on 403 | Error code mapping | ⏳ |
| throws NOT_FOUND on 404 | Error code mapping | ⏳ |
| throws INTERNAL_ERROR on 500 | Error code mapping | ⏳ |
| throws SERVICE_UNAVAILABLE on 503 | Error code mapping | ⏳ |
| error includes API message | Error details | ⏳ |
| error includes status code | Error details | ⏳ |

## Test Utilities

- **Mock fetch**: All HTTP tests use mocked `fetch` to avoid real network calls
- **Test fixtures**: Consistent tool definitions used across tests
- **Error scenarios**: Both success and error paths tested

## Running Tests

```bash
# Install dependencies
pnpm install

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

## Coverage Goals

- **Statements**: 100%
- **Branches**: 100%
- **Functions**: 100%
- **Lines**: 100%

## Legend

- ⏳ Pending (test written, awaiting implementation)
- ✅ Passing
- ❌ Failing
