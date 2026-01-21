import type { ToolDefinition, GenericTool } from '../types.js';

// Generic format is the same as the internal ToolDefinition format
export function formatForGeneric(tool: ToolDefinition): GenericTool {
  return {
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'object',
      properties: tool.parameters.properties,
      required: tool.parameters.required
    }
  };
}
