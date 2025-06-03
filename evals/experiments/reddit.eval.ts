import { runEval } from '../evalTools'
import { runLLM } from '../../src/llm'
import { ToolCallMatch } from '../scorers'
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

runEval('reddit', {
    task: (input) =>
        runLLM({
            messages: [{ role: 'user', content: input }],
            tools: [redditToolDefinition],
        }),
    data: [
        {
            input: 'hi', //THIS SHOULD FAIL EVALS and does
            expected: createToolCallMessage(redditToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
        {
            input: 'tell me the most popular story on science reddit',
            expected: createToolCallMessage(redditToolDefinition.name),// EXPECTED has to match the llm's return type / shape type
        },
    ],
    scorers: [ToolCallMatch],
})