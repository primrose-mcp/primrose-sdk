import { describe, it, expect } from 'vitest';
import { formatForAnthropic } from '../src/providers/anthropic.js';
import { formatForOpenAI } from '../src/providers/openai.js';
import { formatForGoogle } from '../src/providers/google.js';
import { formatForAmazon } from '../src/providers/amazon.js';
import { formatForMeta } from '../src/providers/meta.js';
import { formatForMistral } from '../src/providers/mistral.js';
import { formatForGeneric } from '../src/providers/generic.js';

// Test fixture for a sample tool definition (internal format)
const sampleTool = {
  name: 'hubspot_create_contact',
  description: 'Creates a new contact in HubSpot',
  parameters: {
    type: 'object' as const,
    properties: {
      email: {
        type: 'string',
        description: 'Contact email address'
      },
      firstName: {
        type: 'string',
        description: 'Contact first name'
      },
      lastName: {
        type: 'string',
        description: 'Contact last name'
      },
      phone: {
        type: 'number',
        description: 'Contact phone number'
      },
      isActive: {
        type: 'boolean',
        description: 'Whether the contact is active'
      },
      tags: {
        type: 'array',
        description: 'Contact tags',
        items: { type: 'string' }
      },
      metadata: {
        type: 'object',
        description: 'Additional metadata'
      }
    },
    required: ['email']
  }
};

describe('Provider Formatters', () => {
  describe('Anthropic format', () => {
    it('outputs correct structure with input_schema', () => {
      const formatted = formatForAnthropic(sampleTool);

      expect(formatted).toHaveProperty('name', 'hubspot_create_contact');
      expect(formatted).toHaveProperty('description', 'Creates a new contact in HubSpot');
      expect(formatted).toHaveProperty('input_schema');
      expect(formatted.input_schema).toHaveProperty('type', 'object');
      expect(formatted.input_schema).toHaveProperty('properties');
      expect(formatted.input_schema).toHaveProperty('required');
    });

    it('preserves property types in lowercase', () => {
      const formatted = formatForAnthropic(sampleTool);

      expect(formatted.input_schema.properties.email.type).toBe('string');
      expect(formatted.input_schema.properties.phone.type).toBe('number');
      expect(formatted.input_schema.properties.isActive.type).toBe('boolean');
      expect(formatted.input_schema.properties.tags.type).toBe('array');
      expect(formatted.input_schema.properties.metadata.type).toBe('object');
    });

    it('preserves required array', () => {
      const formatted = formatForAnthropic(sampleTool);

      expect(formatted.input_schema.required).toEqual(['email']);
    });
  });

  describe('OpenAI format', () => {
    it('outputs correct structure with type: function wrapper', () => {
      const formatted = formatForOpenAI(sampleTool);

      expect(formatted).toHaveProperty('type', 'function');
      expect(formatted).toHaveProperty('function');
      expect(formatted.function).toHaveProperty('name', 'hubspot_create_contact');
      expect(formatted.function).toHaveProperty('description', 'Creates a new contact in HubSpot');
      expect(formatted.function).toHaveProperty('parameters');
      expect(formatted.function.parameters).toHaveProperty('type', 'object');
      expect(formatted.function.parameters).toHaveProperty('properties');
      expect(formatted.function.parameters).toHaveProperty('required');
    });

    it('preserves property structure in parameters', () => {
      const formatted = formatForOpenAI(sampleTool);

      expect(formatted.function.parameters.properties.email.type).toBe('string');
      expect(formatted.function.parameters.properties.email.description).toBe('Contact email address');
    });

    it('preserves required array', () => {
      const formatted = formatForOpenAI(sampleTool);

      expect(formatted.function.parameters.required).toEqual(['email']);
    });
  });

  describe('Google format', () => {
    it('outputs correct structure with OBJECT type', () => {
      const formatted = formatForGoogle(sampleTool);

      expect(formatted).toHaveProperty('name', 'hubspot_create_contact');
      expect(formatted).toHaveProperty('description', 'Creates a new contact in HubSpot');
      expect(formatted).toHaveProperty('parameters');
      expect(formatted.parameters).toHaveProperty('type', 'OBJECT');
      expect(formatted.parameters).toHaveProperty('properties');
      expect(formatted.parameters).toHaveProperty('required');
    });

    it('uses uppercase types for properties', () => {
      const formatted = formatForGoogle(sampleTool);

      expect(formatted.parameters.properties.email.type).toBe('STRING');
      expect(formatted.parameters.properties.phone.type).toBe('NUMBER');
      expect(formatted.parameters.properties.isActive.type).toBe('BOOLEAN');
      expect(formatted.parameters.properties.tags.type).toBe('ARRAY');
      expect(formatted.parameters.properties.metadata.type).toBe('OBJECT');
    });

    it('preserves required array', () => {
      const formatted = formatForGoogle(sampleTool);

      expect(formatted.parameters.required).toEqual(['email']);
    });
  });

  describe('Amazon format', () => {
    it('outputs correct structure with toolSpec wrapper', () => {
      const formatted = formatForAmazon(sampleTool);

      expect(formatted).toHaveProperty('toolSpec');
      expect(formatted.toolSpec).toHaveProperty('name', 'hubspot_create_contact');
      expect(formatted.toolSpec).toHaveProperty('description', 'Creates a new contact in HubSpot');
      expect(formatted.toolSpec).toHaveProperty('inputSchema');
      expect(formatted.toolSpec.inputSchema).toHaveProperty('json');
      expect(formatted.toolSpec.inputSchema.json).toHaveProperty('type', 'object');
      expect(formatted.toolSpec.inputSchema.json).toHaveProperty('properties');
      expect(formatted.toolSpec.inputSchema.json).toHaveProperty('required');
    });

    it('preserves property structure in inputSchema.json', () => {
      const formatted = formatForAmazon(sampleTool);

      expect(formatted.toolSpec.inputSchema.json.properties.email.type).toBe('string');
      expect(formatted.toolSpec.inputSchema.json.properties.email.description).toBe('Contact email address');
    });

    it('preserves required array', () => {
      const formatted = formatForAmazon(sampleTool);

      expect(formatted.toolSpec.inputSchema.json.required).toEqual(['email']);
    });
  });

  describe('Meta format', () => {
    it('outputs same structure as OpenAI format', () => {
      const formatted = formatForMeta(sampleTool);

      expect(formatted).toHaveProperty('type', 'function');
      expect(formatted).toHaveProperty('function');
      expect(formatted.function).toHaveProperty('name', 'hubspot_create_contact');
      expect(formatted.function).toHaveProperty('description', 'Creates a new contact in HubSpot');
      expect(formatted.function).toHaveProperty('parameters');
      expect(formatted.function.parameters).toHaveProperty('type', 'object');
      expect(formatted.function.parameters).toHaveProperty('properties');
      expect(formatted.function.parameters).toHaveProperty('required');
    });

    it('preserves property structure', () => {
      const formatted = formatForMeta(sampleTool);

      expect(formatted.function.parameters.properties.email.type).toBe('string');
    });
  });

  describe('Mistral format', () => {
    it('outputs same structure as OpenAI format', () => {
      const formatted = formatForMistral(sampleTool);

      expect(formatted).toHaveProperty('type', 'function');
      expect(formatted).toHaveProperty('function');
      expect(formatted.function).toHaveProperty('name', 'hubspot_create_contact');
      expect(formatted.function).toHaveProperty('description', 'Creates a new contact in HubSpot');
      expect(formatted.function).toHaveProperty('parameters');
      expect(formatted.function.parameters).toHaveProperty('type', 'object');
      expect(formatted.function.parameters).toHaveProperty('properties');
      expect(formatted.function.parameters).toHaveProperty('required');
    });

    it('preserves property structure', () => {
      const formatted = formatForMistral(sampleTool);

      expect(formatted.function.parameters.properties.email.type).toBe('string');
    });
  });

  describe('Generic format', () => {
    it('outputs correct structure with parameters', () => {
      const formatted = formatForGeneric(sampleTool);

      expect(formatted).toHaveProperty('name', 'hubspot_create_contact');
      expect(formatted).toHaveProperty('description', 'Creates a new contact in HubSpot');
      expect(formatted).toHaveProperty('parameters');
      expect(formatted.parameters).toHaveProperty('type', 'object');
      expect(formatted.parameters).toHaveProperty('properties');
      expect(formatted.parameters).toHaveProperty('required');
    });

    it('preserves property types in lowercase', () => {
      const formatted = formatForGeneric(sampleTool);

      expect(formatted.parameters.properties.email.type).toBe('string');
      expect(formatted.parameters.properties.phone.type).toBe('number');
      expect(formatted.parameters.properties.isActive.type).toBe('boolean');
    });

    it('preserves required array', () => {
      const formatted = formatForGeneric(sampleTool);

      expect(formatted.parameters.required).toEqual(['email']);
    });
  });
});
