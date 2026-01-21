import { describe, it, expect } from 'vitest';
import { PrimroseError } from '../src/errors.js';

describe('PrimroseError', () => {
  describe('class structure', () => {
    it('extends Error', () => {
      const error = new PrimroseError('Test error', 'TEST_CODE');
      expect(error).toBeInstanceOf(Error);
    });

    it('has name property set to "PrimroseError"', () => {
      const error = new PrimroseError('Test error', 'TEST_CODE');
      expect(error.name).toBe('PrimroseError');
    });

    it('has code property', () => {
      const error = new PrimroseError('Test error', 'UNAUTHORIZED');
      expect(error.code).toBe('UNAUTHORIZED');
    });

    it('has message property', () => {
      const error = new PrimroseError('Test error message', 'TEST_CODE');
      expect(error.message).toBe('Test error message');
    });

    it('has optional status property', () => {
      const errorWithStatus = new PrimroseError('Test error', 'UNAUTHORIZED', 401);
      expect(errorWithStatus.status).toBe(401);

      const errorWithoutStatus = new PrimroseError('Test error', 'TEST_CODE');
      expect(errorWithoutStatus.status).toBeUndefined();
    });
  });

  describe('error handling', () => {
    it('can be caught as Error', () => {
      let caughtError: Error | null = null;

      try {
        throw new PrimroseError('Test error', 'TEST_CODE');
      } catch (e) {
        if (e instanceof Error) {
          caughtError = e;
        }
      }

      expect(caughtError).not.toBeNull();
      expect(caughtError).toBeInstanceOf(Error);
    });

    it('instanceof works correctly', () => {
      const error = new PrimroseError('Test error', 'TEST_CODE', 500);

      expect(error instanceof PrimroseError).toBe(true);
      expect(error instanceof Error).toBe(true);
    });
  });

  describe('error codes', () => {
    it('accepts UNAUTHORIZED code', () => {
      const error = new PrimroseError('Unauthorized', 'UNAUTHORIZED', 401);
      expect(error.code).toBe('UNAUTHORIZED');
      expect(error.status).toBe(401);
    });

    it('accepts PAYMENT_REQUIRED code', () => {
      const error = new PrimroseError('Payment required', 'PAYMENT_REQUIRED', 402);
      expect(error.code).toBe('PAYMENT_REQUIRED');
      expect(error.status).toBe(402);
    });

    it('accepts FORBIDDEN code', () => {
      const error = new PrimroseError('Forbidden', 'FORBIDDEN', 403);
      expect(error.code).toBe('FORBIDDEN');
      expect(error.status).toBe(403);
    });

    it('accepts NOT_FOUND code', () => {
      const error = new PrimroseError('Not found', 'NOT_FOUND', 404);
      expect(error.code).toBe('NOT_FOUND');
      expect(error.status).toBe(404);
    });

    it('accepts INTERNAL_ERROR code', () => {
      const error = new PrimroseError('Internal error', 'INTERNAL_ERROR', 500);
      expect(error.code).toBe('INTERNAL_ERROR');
      expect(error.status).toBe(500);
    });

    it('accepts SERVICE_UNAVAILABLE code', () => {
      const error = new PrimroseError('Service unavailable', 'SERVICE_UNAVAILABLE', 503);
      expect(error.code).toBe('SERVICE_UNAVAILABLE');
      expect(error.status).toBe(503);
    });
  });
});
