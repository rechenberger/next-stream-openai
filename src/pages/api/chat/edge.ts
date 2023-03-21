import { openAIStream } from '@/server/openAiStream'

export const config = {
  runtime: 'edge',
}

const handler = async (): Promise<Response> => {
  try {
    const stream = await openAIStream({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'user',
          content: 'Hi. How are you?',
        },
      ],
    })

    return new Response(stream)
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}

export default handler
