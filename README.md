# ai-agents-protoy-to-production


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