import { useState } from 'react'

export const useStream = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [messageIsStreaming, setMessageIsStreaming] = useState<boolean>(false)
  const [messageError, setMessageError] = useState<boolean>(false)
  const [responseString, setResponseString] = useState<string>('')

  const send = async ({ url }: { url: string }) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // body: JSON.stringify(chatBody),
    })

    if (!response.ok) {
      setIsLoading(false)
      setMessageIsStreaming(false)
      setMessageError(true)
      return
    }

    const data = response.body

    if (!data) {
      setIsLoading(false)
      setMessageIsStreaming(false)
      setMessageError(true)

      return
    }

    setIsLoading(false)

    const reader = data.getReader()
    const decoder = new TextDecoder()
    let done = false
    let text = ''

    while (!done) {
      const { value, done: doneReading } = await reader.read()
      done = doneReading
      const chunkValue = decoder.decode(value)

      text += chunkValue
      setResponseString(text)
    }
  }

  return {
    send,
    isLoading,
    messageIsStreaming,
    messageError,
    responseString,
  }
}
