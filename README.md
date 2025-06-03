# ai-agents-prototype-to-production

Whats up fellow nerds! This awesome project writen in typescript mostly has all the excitement of agent building blocks of ai woop woop I wrote evals to measure LLM and tool accuracy. Implemented a Retrieval Augmented Generation (RAG) pipeline and explored how structured outputs provide a predictable schema for LLM responses aka structured output. Responsibly managed costs and token limits with proper context memory management. Built better guardrails within the system with human-in-the-loop best practices.

## openai setup
first add a dotenv file in your project and grab a OPENAI_API_KEY key from openai

```
// .env

OPENAI_API_KEY='[put your key here]'

```

to start run yarn then run yarn start with your message 

```bash
yarn ; yarn run start "tell me a joke about science"

```

## eval frontend dashboard

## RAG ingest

we will ingest our data into our vector DB

1. ### Make an index in upstash

- Log into your upstash account
- select **Vector**
- Click “create index”
- Name your index whatever you want
- Choose the Mixedbread embedding model (any will work really)
- Keep COSINE selected
- Select next and choose the free tier
- Once its created, get your env vars and add them to your `.env` file

```
UPSTASH_VECTOR_REST_URL=[yours here]
UPSTASH_VECTOR_REST_TOKEN=[yours here]
```

for a full tutorial jump on [frontendmasters](https://frontendmasters.com/courses/production-ai/) where scott moss breaks down all the important building blocks of ai
