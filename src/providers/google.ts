import type { ToolDefinition, GoogleTool, GoogleToolParameter, ToolParameter } from '../types.js';

function convertTypeToUppercase(type: string): string {
  return type.toUpperCase();
}

function convertPropertiesToGoogle(
  properties: Record<string, ToolParameter>
): Record<string, GoogleToolParameter> {
  const result: Record<string, GoogleToolParameter> = {};

  for (const [key, prop] of Object.entries(properties)) {
    const googleProp: GoogleToolParameter = {
      type: convertTypeToUppercase(prop.type),
      description: prop.description
    };

    if (prop.enum) {
      googleProp.enum = prop.enum;
    }

    if (prop.items) {
      googleProp.items = {
        type: convertTypeToUppercase(prop.items.type),
        description: prop.items.description
      };
    }

    if (prop.properties) {
      googleProp.properties = convertPropertiesToGoogle(prop.properties);
    }

    if (prop.required) {
      googleProp.required = prop.required;
    }

    result[key] = googleProp;
  }

  return result;
}

export function formatForGoogle(tool: ToolDefinition): GoogleTool {
  return {
    name: tool.name,
    description: tool.description,
    parameters: {
      type: 'OBJECT',
      properties: convertPropertiesToGoogle(tool.parameters.properties),
      required: tool.parameters.required
    }
  };
}
