'use client'

import type { StoreApi as MinimalStoreApi } from '@minimal/zustand/vanilla'
import type { StoreApi as OfficialStoreApi } from 'zustand/vanilla'
import { useStore as useMinimalStore } from '@minimal/zustand'
import { createStore as createMinimalStore } from '@minimal/zustand/vanilla'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { useStore as useOfficialStore } from 'zustand'
import { createStore as createOfficialStore } from 'zustand/vanilla'

interface CounterState {
  count: number
  inc: () => void
  setCount: (count: number) => void
}

interface HydrationState {
  now: number
  setNow: (now: number) => void
}

const minimalHydrationStore = createMinimalStore<HydrationState>(set => ({
  now: 0,
  setNow: now => set({ now }),
}))

// 故意制造“服务端 HTML(0) vs 客户端水合(now)”的差异：让 hydration 期间的 getState 已经不是 initial。
if (typeof window !== 'undefined') {
  minimalHydrationStore.setState({ now: Date.now() })
}

function useMinimalStoreBadHydration<TState, Slice>(
  api: Pick<MinimalStoreApi<TState>, 'subscribe' | 'getState'>,
  selector: (state: TState) => Slice,
) {
  return useSyncExternalStore(
    onStoreChange => api.subscribe(() => onStoreChange()),
    () => selector(api.getState()),
    // 关键：这里故意不用 getInitialState，而是用“当前 getState”当作 server snapshot
    () => selector(api.getState()),
  )
}

export default function ZustandDemoClient({ serverSeed }: { serverSeed: number }) {
  const [minimalStore] = useState<MinimalStoreApi<CounterState>>(() =>
    createMinimalStore<CounterState>(set => ({
      count: serverSeed,
      inc: () => set(state => ({ count: state.count + 1 })),
      setCount: count => set({ count }),
    })),
  )

  const [officialStore] = useState<OfficialStoreApi<CounterState>>(() =>
    createOfficialStore<CounterState>(set => ({
      count: serverSeed,
      inc: () => set(state => ({ count: state.count + 1 })),
      setCount: count => set({ count }),
    })),
  )

  const minimalCount = useMinimalStore(minimalStore, s => s.count)
  const minimalInc = useMinimalStore(minimalStore, s => s.inc)
  const minimalSetCount = useMinimalStore(minimalStore, s => s.setCount)

  const officialCount = useOfficialStore(officialStore, s => s.count)
  const officialInc = useOfficialStore(officialStore, s => s.inc)
  const officialSetCount = useOfficialStore(officialStore, s => s.setCount)

  useEffect(() => {
    const id = setInterval(() => {
      minimalHydrationStore.getState().setNow(Date.now())
    }, 1000)

    return () => clearInterval(id)
  }, [])

  const goodNow = useMinimalStore(minimalHydrationStore, s => s.now)
  const badNow = useMinimalStoreBadHydration(minimalHydrationStore, s => s.now)

  return (
    <section className="w-full rounded-xl border border-black/10 p-6 dark:border-white/15">
      <h2 className="text-lg font-semibold">RCC (Client Component)</h2>
      <p className="mt-1 text-sm text-black/60 dark:text-white/60">
        这块会在浏览器运行：RSC 传入初始值（serverSeed），Client 侧用 vanilla store + getInitialState
        做 SSR/水合一致性；并通过 useState initializer 保持单次挂载内 store 稳定（不再用 useMemo 生成 hook）。
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <div className="text-sm font-medium">@minimal/zustand</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">{minimalCount}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="h-10 rounded-full bg-foreground px-4 text-background"
              onClick={minimalInc}
            >
              +1
            </button>
            <button
              type="button"
              className="h-10 rounded-full border border-black/10 px-4 dark:border-white/15"
              onClick={() => minimalSetCount(serverSeed)}
            >
              reset →
              {' '}
              {serverSeed}
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
          <div className="text-sm font-medium">zustand (official)</div>
          <div className="mt-2 text-2xl font-semibold tabular-nums">{officialCount}</div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              className="h-10 rounded-full bg-foreground px-4 text-background"
              onClick={officialInc}
            >
              +1
            </button>
            <button
              type="button"
              className="h-10 rounded-full border border-black/10 px-4 dark:border-white/15"
              onClick={() => officialSetCount(serverSeed)}
            >
              reset →
              {' '}
              {serverSeed}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg border border-black/10 p-4 dark:border-white/15">
        <div className="text-sm font-medium">Hydration warning demo</div>
        <p className="mt-1 text-sm text-black/60 dark:text-white/60">
          左侧是正确做法（用 getInitialState 作为 server snapshot），右侧是错误做法（用当前 getState 当作 server snapshot），
          右侧会在控制台直接看到 hydration warning。下面数值会每秒更新一次。
        </p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
            <div className="text-sm font-medium">good (getInitialState)</div>
            <div className="mt-2 text-sm font-mono tabular-nums">{goodNow}</div>
            <div className="mt-1 text-xs font-mono tabular-nums text-black/60 dark:text-white/60">
              {new Date(goodNow).toISOString()}
            </div>
          </div>

          <div className="rounded-lg border border-black/10 p-4 dark:border-white/15">
            <div className="text-sm font-medium">bad (getState as server snapshot)</div>
            <div className="mt-2 text-sm font-mono tabular-nums">{badNow}</div>
            <div className="mt-1 text-xs font-mono tabular-nums text-black/60 dark:text-white/60">
              {new Date(badNow).toISOString()}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
