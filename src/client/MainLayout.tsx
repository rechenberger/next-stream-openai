import Head from 'next/head'
import { type ReactNode } from 'react'

export const MainLayout = ({ children }: { children?: ReactNode }) => {
  return (
    <>
      <Head>
        <title>OpenAI Stream</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-tr from-purple-900 to-red-900 text-white">
        <div className="container flex flex-col items-center justify-center gap-4 px-4 py-16 ">
          {children}
        </div>
      </main>
    </>
  )
}
