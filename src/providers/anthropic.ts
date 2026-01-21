import type { ToolDefinition, AnthropicTool } from '../types.js';

export function formatForAnthropic(tool: ToolDefinition): AnthropicTool {
  return {
    name: tool.name,
    description: tool.description,
    input_schema: {
      type: 'object',
      properties: tool.parameters.properties,
      required: tool.parameters.required
    }
  };
}
