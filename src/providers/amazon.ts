import type { ToolDefinition, AmazonTool } from '../types.js';

export function formatForAmazon(tool: ToolDefinition): AmazonTool {
  return {
    toolSpec: {
      name: tool.name,
      description: tool.description,
      inputSchema: {
        json: {
          type: 'object',
          properties: tool.parameters.properties,
          required: tool.parameters.required
        }
      }
    }
  };
}
