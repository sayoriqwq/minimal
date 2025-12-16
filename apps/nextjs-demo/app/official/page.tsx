import HomePageClient from './_components/HomePageClient'
import { CounterStoreProvider } from './providers/counter-store-provider'

export default function ZustandOfficialDemoPage() {
  const serverSeed = Math.floor(Date.now() / 1000)

  return (
    <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
      <main className="w-full max-w-3xl px-6 py-16">
        <h1 className="text-2xl font-semibold tracking-tight">Zustand Next.js 官方指南 Demo</h1>
        <p className="mt-2 text-sm text-black/60 dark:text-white/60">
          访问路径：/zustand-official-demo（该页面不依赖你现有 demo 的实现）。
        </p>

        <div className="mt-8 grid gap-6">
          <CounterStoreProvider initialState={{ count: serverSeed }}>
            <HomePageClient serverSeed={serverSeed} />
          </CounterStoreProvider>
        </div>
      </main>
    </div>
  )
}
