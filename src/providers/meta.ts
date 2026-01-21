import type { ToolDefinition, MetaTool } from '../types.js';
import { formatForOpenAI } from './openai.js';

// Meta uses the same format as OpenAI
export function formatForMeta(tool: ToolDefinition): MetaTool {
  return formatForOpenAI(tool);
}
