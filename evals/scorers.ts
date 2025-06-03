import type { Scorer } from 'autoevals';

export const ToolCallMatch: Scorer<any, {}> = async ({ input, output, expected }) => {
    const isValidToolCall =
        output.role === 'assistant' &&
        Array.isArray(output.tool_calls) &&
        output.tool_calls.length === 1 &&
        output.tool_calls[0]?.function?.name === expected.tool_calls[0]?.function?.name;

    return {
        name: 'ToolCallMatch',
        score: isValidToolCall ? 1 : 0,
    };
};