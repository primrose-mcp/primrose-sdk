import type { ToolDefinition, Provider, FormattedTool } from '../types.js';
import { formatForAnthropic } from './anthropic.js';
import { formatForOpenAI } from './openai.js';
import { formatForGoogle } from './google.js';
import { formatForAmazon } from './amazon.js';
import { formatForMeta } from './meta.js';
import { formatForMistral } from './mistral.js';
import { formatForGeneric } from './generic.js';

export function formatForProvider(tool: ToolDefinition, provider: Provider): FormattedTool {
  switch (provider) {
    case 'anthropic':
      return formatForAnthropic(tool);
    case 'openai':
      return formatForOpenAI(tool);
    case 'google':
      return formatForGoogle(tool);
    case 'amazon':
      return formatForAmazon(tool);
    case 'meta':
      return formatForMeta(tool);
    case 'mistral':
      return formatForMistral(tool);
    case 'generic':
    default:
      return formatForGeneric(tool);
  }
}

export {
  formatForAnthropic,
  formatForOpenAI,
  formatForGoogle,
  formatForAmazon,
  formatForMeta,
  formatForMistral,
  formatForGeneric
};
