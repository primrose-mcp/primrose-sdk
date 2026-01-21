import type { ToolDefinition, MistralTool } from '../types.js';
import { formatForOpenAI } from './openai.js';

// Mistral uses the same format as OpenAI
export function formatForMistral(tool: ToolDefinition): MistralTool {
  return formatForOpenAI(tool);
}
