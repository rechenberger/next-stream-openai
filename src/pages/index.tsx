import { MainLayout } from '@/client/MainLayout'
import { useStream } from '@/client/useStream'
import { type NextPage } from 'next'

const Page: NextPage = () => {
  const { responseString, send } = useStream()
  return (
    <>
      <MainLayout>
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-5xl font-bold text-white">OpenAI Stream</h1>
          <div className="flex flex-row gap-4">
            <button
              className="rounded border p-2"
              onClick={() => send({ url: '/api/chat/lambda' })}
            >
              Lambda
            </button>
            <button
              className="rounded border p-2"
              onClick={() => send({ url: '/api/chat/edge' })}
            >
              Edge
            </button>
            <button
              className="rounded border p-2"
              onClick={() =>
                typeof window !== 'undefined' && window.location.reload()
              }
            >
              Reset
            </button>
          </div>
          <div className="whitespace-pre-wrap">{responseString}</div>
        </div>
      </MainLayout>
    </>
  )
}

export default Page
