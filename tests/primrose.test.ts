import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { Primrose } from '../src/index.js';
import { PrimroseError } from '../src/errors.js';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Test fixtures
const mockToolDefinition = {
  name: 'hubspot_create_contact',
  description: 'Creates a new contact in HubSpot',
  parameters: {
    type: 'object',
    properties: {
      email: { type: 'string', description: 'Contact email address' },
      firstName: { type: 'string', description: 'Contact first name' }
    },
    required: ['email']
  }
};

const mockToolsResponse = {
  tools: [mockToolDefinition]
};

const mockCallToolResponse = {
  result: {
    contactId: '12345',
    email: 'test@example.com'
  }
};

describe('Primrose', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Constructor', () => {
    it('accepts apiKey and provider', () => {
      const primrose = new Primrose({
        apiKey: 'prm_test123',
        provider: 'anthropic'
      });

      expect(primrose).toBeInstanceOf(Primrose);
    });

    it('throws Error if apiKey is missing', () => {
      expect(() => {
        // @ts-expect-error - Testing missing apiKey
        new Primrose({});
      }).toThrow();
    });

    it('throws Error if apiKey is empty string', () => {
      expect(() => {
        new Primrose({ apiKey: '' });
      }).toThrow();
    });

    it('defaults provider to "generic" if not specified', () => {
      const primrose = new Primrose({ apiKey: 'prm_test123' });

      // We'll verify this through the API call which should include provider=generic
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      primrose.listTools();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('provider=generic'),
        expect.any(Object)
      );
    });

    it('accepts baseUrl override', () => {
      const primrose = new Primrose({
        apiKey: 'prm_test123',
        baseUrl: 'https://custom.api.com'
      });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      primrose.listTools();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://custom.api.com'),
        expect.any(Object)
      );
    });

    it('defaults baseUrl to "https://api.primrose.dev"', () => {
      const primrose = new Primrose({ apiKey: 'prm_test123' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      primrose.listTools();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('https://api.primrose.dev'),
        expect.any(Object)
      );
    });

    it('accepts all valid providers', () => {
      const validProviders = ['anthropic', 'openai', 'google', 'amazon', 'meta', 'mistral', 'generic'] as const;

      validProviders.forEach(provider => {
        expect(() => {
          new Primrose({ apiKey: 'prm_test123', provider });
        }).not.toThrow();
      });
    });

    it('throws Error for invalid provider', () => {
      expect(() => {
        new Primrose({
          apiKey: 'prm_test123',
          // @ts-expect-error - Testing invalid provider
          provider: 'invalid_provider'
        });
      }).toThrow();
    });
  });

  describe('listTools()', () => {
    it('returns array of tool definitions', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      const tools = await primrose.listTools();

      expect(Array.isArray(tools)).toBe(true);
      expect(tools.length).toBeGreaterThan(0);
      expect(tools[0]).toHaveProperty('name');
      expect(tools[0]).toHaveProperty('description');
    });

    it('calls GET /tools with Authorization header', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      await primrose.listTools();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/tools'),
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Authorization': 'Bearer prm_test123'
          })
        })
      );
    });

    it('passes provider query param', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'openai' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      await primrose.listTools();

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('provider=openai'),
        expect.any(Object)
      );
    });

    it('accepts optional mcpServer filter', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      await primrose.listTools({ mcpServer: 'hubspot' });

      expect(mockFetch).toHaveBeenCalled();
    });

    it('passes mcp_server query param when filter provided', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      await primrose.listTools({ mcpServer: 'hubspot' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('mcp_server=hubspot'),
        expect.any(Object)
      );
    });

    it('returns empty array when API returns empty', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tools: [] })
      });

      const tools = await primrose.listTools();

      expect(tools).toEqual([]);
    });

    it('throws PrimroseError on 401 response', async () => {
      const primrose = new Primrose({ apiKey: 'prm_invalid', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized', message: 'Invalid API key' })
      });

      try {
        await primrose.listTools();
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).code).toBe('UNAUTHORIZED');
      }
    });

    it('throws PrimroseError on 500 response', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error', message: 'Something went wrong' })
      });

      try {
        await primrose.listTools();
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).code).toBe('INTERNAL_ERROR');
      }
    });
  });

  describe('searchTools()', () => {
    it('returns array of matching tools', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      const tools = await primrose.searchTools('hubspot');

      expect(Array.isArray(tools)).toBe(true);
    });

    it('calls GET /tools/search with q query param', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      await primrose.searchTools('create contact');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/tools/search'),
        expect.any(Object)
      );
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('q='),
        expect.any(Object)
      );
    });

    it('passes provider query param', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'google' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockToolsResponse
      });

      await primrose.searchTools('hubspot');

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('provider=google'),
        expect.any(Object)
      );
    });

    it('returns empty array for no matches', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ tools: [] })
      });

      const tools = await primrose.searchTools('nonexistent_tool');

      expect(tools).toEqual([]);
    });

    it('throws PrimroseError on API error', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error', message: 'Search failed' })
      });

      await expect(primrose.searchTools('hubspot')).rejects.toThrow(PrimroseError);
    });
  });

  describe('callTool()', () => {
    it('returns result data on success', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCallToolResponse
      });

      const result = await primrose.callTool('hubspot_create_contact', { email: 'test@example.com' });

      expect(result).toHaveProperty('result');
      expect(result.result).toHaveProperty('contactId');
    });

    it('calls POST /tools/call with tool and params in body', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockCallToolResponse
      });

      await primrose.callTool('hubspot_create_contact', { email: 'test@example.com' });

      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/tools/call'),
        expect.objectContaining({
          method: 'POST',
          body: expect.stringContaining('hubspot_create_contact')
        })
      );

      const callArgs = mockFetch.mock.calls[0];
      const body = JSON.parse(callArgs[1].body);
      expect(body).toHaveProperty('tool', 'hubspot_create_contact');
      expect(body).toHaveProperty('params');
      expect(body.params).toHaveProperty('email', 'test@example.com');
    });

    it('throws PrimroseError with code "UNAUTHORIZED" on 401', async () => {
      const primrose = new Primrose({ apiKey: 'prm_invalid', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({ error: 'Unauthorized', message: 'Invalid API key' })
      });

      try {
        await primrose.callTool('hubspot_create_contact', { email: 'test@example.com' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).code).toBe('UNAUTHORIZED');
      }
    });

    it('throws PrimroseError with code "PAYMENT_REQUIRED" on 402', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 402,
        json: async () => ({ error: 'Payment Required', message: 'Subscription expired' })
      });

      try {
        await primrose.callTool('hubspot_create_contact', { email: 'test@example.com' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).code).toBe('PAYMENT_REQUIRED');
      }
    });

    it('throws PrimroseError with code "FORBIDDEN" on 403', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden', message: 'Access denied to this tool' })
      });

      try {
        await primrose.callTool('restricted_tool', {});
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).code).toBe('FORBIDDEN');
      }
    });

    it('throws PrimroseError with code "NOT_FOUND" on 404', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Not Found', message: 'Tool not found' })
      });

      try {
        await primrose.callTool('nonexistent_tool', {});
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).code).toBe('NOT_FOUND');
      }
    });

    it('throws PrimroseError with code "INTERNAL_ERROR" on 500', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Server Error', message: 'Something went wrong' })
      });

      try {
        await primrose.callTool('hubspot_create_contact', { email: 'test@example.com' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).code).toBe('INTERNAL_ERROR');
      }
    });

    it('throws PrimroseError with code "SERVICE_UNAVAILABLE" on 503', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 503,
        json: async () => ({ error: 'Service Unavailable', message: 'Service temporarily unavailable' })
      });

      try {
        await primrose.callTool('hubspot_create_contact', { email: 'test@example.com' });
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).code).toBe('SERVICE_UNAVAILABLE');
      }
    });

    it('PrimroseError includes message from API response', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });
      const errorMessage = 'Custom error message from API';

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Bad Request', message: errorMessage })
      });

      try {
        await primrose.callTool('hubspot_create_contact', {});
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).message).toContain(errorMessage);
      }
    });

    it('PrimroseError includes status code', async () => {
      const primrose = new Primrose({ apiKey: 'prm_test123', provider: 'anthropic' });

      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 418,
        json: async () => ({ error: "I'm a teapot", message: 'Cannot brew coffee' })
      });

      try {
        await primrose.callTool('coffee_maker', {});
        expect.fail('Should have thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(PrimroseError);
        expect((error as PrimroseError).status).toBe(418);
      }
    });
  });
});
