import type { ToolDefinition, OpenAITool } from '../types.js';

export function formatForOpenAI(tool: ToolDefinition): OpenAITool {
  return {
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: {
        type: 'object',
        properties: tool.parameters.properties,
        required: tool.parameters.required
      }
    }
  };
}
