import { JSONFilePreset } from 'lowdb/node'
import type { AIMessage } from '../types'
import { v4 as uuidv4 } from 'uuid'
import { summarizeMessages } from './llm'

export type MessageWithMetadata = AIMessage & {
    id: string
    createdAt: string
}

type Data = {
    messages: MessageWithMetadata[]
    summary: string
}

export const addMetadata = (message: AIMessage) => {
    return {
        ...message,
        id: uuidv4(),
        createdAt: new Date().toISOString(),
    }
}

export const removeMetadata = (message: MessageWithMetadata) => {
    const { id, createdAt, ...rest } = message
    return rest
}

const defaultData: Data = {
    messages: [],
    summary: ''
}

export const getDb = async () => {
    const db = await JSONFilePreset<Data>('db.json', defaultData)
    return db
}

export const addMessages = async (messages: AIMessage[]) => {
    const db = await getDb()
    db.data.messages.push(...messages.map(addMetadata))

    if (db.data.messages.length >= 10) {
        const oldestMessages = db.data.messages.slice(0, 5).map(removeMetadata)
        const summary = await summarizeMessages(oldestMessages)
        db.data.summary = summary
    }
    await db.write()
}

export const getMessages = async () => {
    const db = await getDb()
    const messages = await db.data.messages.map(removeMetadata)
    const lastFive = messages.slice(-5)

    // If first message is a tool response, get one more message before it
    if (lastFive[0]?.role === 'tool') {
        const sixthMessage = messages[messages.length - 6]
        if (sixthMessage) {
            return [sixthMessage, ...lastFive]
        }
    }

    return lastFive
}

export const saveToolResponse = async (
    toolCallId: string,
    toolResponse: string
) => {
    return addMessages([
        {
            role: 'tool',
            content: toolResponse,
            tool_call_id: toolCallId,
        },
    ])
}

export const getSummary = async () => {
    const db = await getDb()
    return db.data.summary
}

// 1. get the summary
// 2. get last five messages
// 3. dont leave on a tool response cause that will put the llm in a broken state
// 4. create a summary every 10 messages (change these numbers how you see fit)

