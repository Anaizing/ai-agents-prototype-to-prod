import { runEval } from '../evalTools'
import { runLLM } from '../../src/llm'
import { ToolCallMatch } from '../scorers'
import { dadJokeToolDefinition } from '../../src/tools/dadJoke'

const createToolCallMessage = (toolName: string) => ({ // has to match the llm's return type
    role: 'assistant',
    tool_calls: [
        {
            type: 'function',
            function: { name: toolName },
        },
    ],
})

runEval('dadJoke', {
    task: (input) =>
        runLLM({
            messages: [{ role: 'user', content: input }],
            tools: [dadJokeToolDefinition],
        }),
    data: [
        {
            input: 'tell me a funny dad joke',
            expected: createToolCallMessage(dadJokeToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
    ],
    scorers: [ToolCallMatch],
})