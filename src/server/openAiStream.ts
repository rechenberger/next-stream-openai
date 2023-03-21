import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from 'eventsource-parser'

type Message = {
  role: 'user' | 'system' | 'assistant'
  content: string
}

type OpenAIModel = 'gpt-4' | 'gpt-3.5-turbo'

export const openAIStream = async ({
  model,
  messages,
}: {
  model: OpenAIModel
  messages: Message[]
}) => {
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    headers: {
      'Content-Type': 'application/json',
      'OpenAI-Organization': 'org-5moBa6HipdorhUrZMVrhh7HX',
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    method: 'POST',
    body: JSON.stringify({
      model,
      messages,
      // max_tokens: 1000,
      temperature: 0.0,
      stream: true,
    }),
  })

  if (res.status !== 200) {
    throw new Error('OpenAI API returned an error')
  }

  const encoder = new TextEncoder()
  const decoder = new TextDecoder()

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === 'event') {
          const data = event.data

          if (data === '[DONE]') {
            controller.close()
            return
          }

          try {
            const json = JSON.parse(data)
            const text = json.choices[0].delta.content
            const queue = encoder.encode(text)
            controller.enqueue(queue)
          } catch (e) {
            controller.error(e)
          }
        }
      }

      const parser = createParser(onParse)

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk))
      }
    },
  })

  return stream
}
