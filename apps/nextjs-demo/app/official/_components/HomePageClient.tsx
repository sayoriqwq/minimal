'use client'

import { useCounterStore } from '../providers/use-counter-store'

export default function HomePageClient({ serverSeed }: { serverSeed: number }) {
  const count = useCounterStore(s => s.count)
  const inc = useCounterStore(s => s.incrementCount)
  const dec = useCounterStore(s => s.decrementCount)
  const setCount = useCounterStore(s => s.setCount)

  return (
    <section className="w-full rounded-xl border border-black/10 p-6 dark:border-white/15">
      <h2 className="text-lg font-semibold">zustand 官方 Next.js 指南写法</h2>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        结构：createStore(工厂函数) → Provider/Context 注入 → useCounterStore(selector) 消费。
      </p>

      <dl className="mt-4 grid gap-2 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="text-black/60 dark:text-white/60">serverSeed</dt>
          <dd className="font-mono tabular-nums">{serverSeed}</dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="text-black/60 dark:text-white/60">count</dt>
          <dd className="font-mono tabular-nums">{count}</dd>
        </div>
      </dl>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="h-10 rounded-full bg-foreground px-4 text-background"
          onClick={inc}
        >
          +1
        </button>
        <button
          type="button"
          className="h-10 rounded-full border border-black/10 px-4 dark:border-white/15"
          onClick={dec}
        >
          -1
        </button>
        <button
          type="button"
          className="h-10 rounded-full border border-black/10 px-4 dark:border-white/15"
          onClick={() => setCount(serverSeed)}
        >
          reset →
          {' '}
          {serverSeed}
        </button>
      </div>
    </section>
  )
}
