import { runEval } from '../evalTools'
import { runLLM } from '../../src/llm'
import { ToolCallMatch } from '../scorers'
import { dadJokeToolDefinition } from '../../src/tools/dadJoke'
import { generateImageToolDefinition } from '../../src/tools/generateImage'
import { redditToolDefinition } from '../../src/tools/reddit'

const createToolCallMessage = (toolName: string) => ({ // has to match the llm's return type
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: { name: toolName },
        },
    ],
})

const allTools = [
    dadJokeToolDefinition,
    generateImageToolDefinition,
    redditToolDefinition
]

runEval('allTools', {
    task: (input) =>
        runLLM({
            messages: [{ role: 'user', content: input }],
            tools: allTools,
        }),
    data: [
        {
            input: 'tell me a funny dad joke',
            expected: createToolCallMessage(dadJokeToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
        {
            input: 'take a photo of a cherry blossom',
            expected: createToolCallMessage(generateImageToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
        {
            input: 'tell me what scientists are talking about on reddit',
            expected: createToolCallMessage(redditToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
        
    ],
    scorers: [ToolCallMatch],
})