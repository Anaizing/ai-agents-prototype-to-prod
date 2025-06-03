import 'dotenv/config'
import { runEval } from '../evalTools'
import { runLLM } from '../../src/llm'
import { ToolCallMatch } from '../scorers'
import { generateImageToolDefinition } from '../../src/tools/generateImage'

const createToolCallMessage = (toolName: string) => ({ // has to match the llm's return type
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: { name: toolName },
        },
    ],
})

runEval('generateImage', {
    task: (input) =>
        runLLM({
            messages: [{ role: 'user', content: input }],
            tools: [generateImageToolDefinition],
        }),
    data: [
        {
            input: 'generate an image of a sunrise',
            expected: createToolCallMessage(generateImageToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
        {
            input: 'take a photo of a sunrise',
            expected: createToolCallMessage(generateImageToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
        {
            input: 'take a joke', // SHOULD FAIL EVAL on generateImage
            expected: createToolCallMessage(generateImageToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
    ],
    scorers: [ToolCallMatch],
})