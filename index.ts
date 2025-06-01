import 'dotenv/config'
import { runAgent } from './src/agents'
import { tools } from './src/tools'

const userMessage = process.argv[2]

if (!userMessage) {
    console.error('Please provide a message')
    process.exit(1)
}

await runAgent({ userMessage, tools })
