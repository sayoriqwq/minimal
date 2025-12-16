import ServerInfo from './components/ServerInfo'
import ZustandDemoClient from './components/ZustandDemoClient'

export default function Home() {
  const serverSeed = Math.floor(Date.now() / 1000)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <main className="w-full max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">
          Next.js RSC + RCC Zustand Demo
        </h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          同一页面：上半部分是 RSC（服务端渲染），下半部分是 RCC（客户端组件）。
        </p>

        <div className="mt-8 grid gap-6">
          <ServerInfo serverSeed={serverSeed} />
          <ZustandDemoClient serverSeed={serverSeed} />
        </div>
      </main>
    </div>
  )
}
