import { openAIStream } from '@/server/openAiStream'
import { type NextApiRequest, type NextApiResponse } from 'next'

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
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

    // Set the appropriate response headers
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Transfer-Encoding', 'chunked')

    // Pipe the stream to the response
    const reader = stream.getReader()

    const handleStream = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            res.end()
            break
          }
          res.write(value)
          res.flushHeaders()
        }
      } catch (error) {
        console.error(error)
        res.status(500).end('Error')
      }
    }

    handleStream()
  } catch (error) {
    console.error(error)
    res.status(500).end('Error')
  }
}

export default handler
