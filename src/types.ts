export type Provider = 'anthropic' | 'openai' | 'google' | 'amazon' | 'meta' | 'mistral' | 'generic';

export interface PrimroseConfig {
  apiKey: string;
  provider?: Provider;
  baseUrl?: string;
}

export interface ListToolsOptions {
  mcpServer?: string;
}

export interface ToolParameter {
  type: string;
  description?: string;
  enum?: string[];
  items?: ToolParameter;
  properties?: Record<string, ToolParameter>;
  required?: string[];
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, ToolParameter>;
    required?: string[];
  };
}

// Anthropic tool format
export interface AnthropicTool {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, ToolParameter>;
    required?: string[];
  };
}

// OpenAI tool format
export interface OpenAITool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: {
      type: 'object';
      properties: Record<string, ToolParameter>;
      required?: string[];
    };
  };
}

// Google tool format (uses uppercase types)
export interface GoogleToolParameter {
  type: string; // uppercase: STRING, NUMBER, BOOLEAN, ARRAY, OBJECT
  description?: string;
  enum?: string[];
  items?: GoogleToolParameter;
  properties?: Record<string, GoogleToolParameter>;
  required?: string[];
}

export interface GoogleTool {
  name: string;
  description: string;
  parameters: {
    type: 'OBJECT';
    properties: Record<string, GoogleToolParameter>;
    required?: string[];
  };
}

// Amazon Bedrock tool format
export interface AmazonTool {
  toolSpec: {
    name: string;
    description: string;
    inputSchema: {
      json: {
        type: 'object';
        properties: Record<string, ToolParameter>;
        required?: string[];
      };
    };
  };
}

// Meta uses OpenAI format
export type MetaTool = OpenAITool;

// Mistral uses OpenAI format
export type MistralTool = OpenAITool;

// Generic format (same as ToolDefinition)
export type GenericTool = ToolDefinition;

// Union of all provider tool formats
export type FormattedTool = AnthropicTool | OpenAITool | GoogleTool | AmazonTool | GenericTool;

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: { code: string; message: string };
}

export interface ToolsResponse {
  tools: ToolDefinition[];
}

export interface CallToolResponse<T = unknown> {
  result: T;
}
