import { Index as UpstashIndex } from '@upstash/vector'

// Initialize Upstash Vector client
const index = new UpstashIndex({
    url: process.env.UPSTASH_VECTOR_REST_URL as string,
    token: process.env.UPSTASH_VECTOR_REST_TOKEN as string,
})

type MovieMetadata = {
    title?: string
    year?: string
    genre?: string
    director?: string
    actors?: string
    rating?: string
    votes?: string
    revenue?: string
    metascore?: string
}

export const queryMovies = async (
    query: string,
    // filters, //?: Partial<MovieMetadata>,
    topK: number = 5
) => {
    // Build filter string if filters provided
    let filterStr = ''
    if (filterStr) {
        const filterParts = Object.entries(filterStr)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => `${key}='${value}'`)

        if (filterParts.length > 0) {
            filterStr = filterParts.join(' AND ')
        }
    }

    // Query the vector store
    const results = await index.query({
        data: query,
        topK,
        filter: filterStr || undefined,
        includeMetadata: true,
        includeData: true,
    })

    return results
}
