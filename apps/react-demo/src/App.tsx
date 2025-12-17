import { atom as minimalAtom, useAtom as useMinimalAtom } from '@minimal/jotai'
import { create as createMinimal } from '@minimal/zustand'
import { atom as jotaiAtom, useAtom as useOfficialAtom } from 'jotai'
import { useEffect, useRef } from 'react'
import { create as createOfficial } from 'zustand'
import './App.css'

interface CounterState {
  count: number
  inc: () => void
}

const useMinimalCounter = createMinimal<CounterState>(set => ({
  count: 0,
  inc: () => set(state => ({ count: state.count + 1 })),
}))

const useOfficialCounter = createOfficial<CounterState>(set => ({
  count: 0,
  inc: () => set(state => ({ count: state.count + 1 })),
}))

const minimalCountAtom = minimalAtom(0)
const minimalDoubleAtom = minimalAtom(get => get(minimalCountAtom) * 2)

const officialCountAtom = jotaiAtom(0)
const officialDoubleAtom = jotaiAtom(get => get(officialCountAtom) * 2)

function useRenderTracker(label: string) {
  const renders = useRef(0)
  renders.current += 1

  useEffect(() => {
    console.log(`[render] ${label}: #${renders.current}`)
  })
}

interface ZustandButtonsProps {
  label: string
  count: number
  onInc: () => void
}

function ZustandButtons({
  label,
  count,
  onInc,
}: ZustandButtonsProps) {
  return (
    <button onClick={onInc}>
      {label}
      {' '}
      {count}
    </button>
  )
}

interface JotaiPanelProps {
  badge: string
  title: string
  description: string
  count: number
  double: number
  onInc: () => void
  onReset: () => void
}

function JotaiPanel({
  badge,
  title,
  description,
  count,
  double,
  onInc,
  onReset,
}: JotaiPanelProps) {
  useRenderTracker(`Jotai 面板 - ${title}`)

  return (
    <div className="panel">
      <div className="panel__head">
        <span className="badge">{badge}</span>
        <h2>{title}</h2>
      </div>
      <p className="note">{description}</p>
      <div className="metrics">
        <div>
          <div className="metric-label">count</div>
          <div className="metric-value">{count}</div>
        </div>
        <div>
          <div className="metric-label">derived x2</div>
          <div className="metric-value">{double}</div>
        </div>
      </div>
      <div className="actions">
        <button onClick={onInc}>+1</button>
        <button className="ghost" onClick={onReset}>Reset</button>
      </div>
    </div>
  )
}

function MinimalZustandPanel() {
  useRenderTracker('Zustand 面板 - Minimal')
  const minimalCount = useMinimalCounter((s: CounterState) => s.count)
  const minimalInc = useMinimalCounter((s: CounterState) => s.inc)

  return (
    <ZustandButtons
      label="@minimal/zustand count is"
      count={minimalCount}
      onInc={minimalInc}
    />
  )
}

function OfficialZustandPanel() {
  useRenderTracker('Zustand 面板 - Official')
  const officialCount = useOfficialCounter(s => s.count)
  const officialInc = useOfficialCounter(s => s.inc)

  return (
    <ZustandButtons
      label="zustand (official) count is"
      count={officialCount}
      onInc={officialInc}
    />
  )
}

function ZustandDemo() {
  useRenderTracker('Zustand Demo')

  return (
    <section className="block">
      <div className="block__header">
        <p className="eyebrow">zustand</p>
        <h1>Zustand demo</h1>
        <p className="note">左边是 workspace 内的 @minimal/zustand，右边是官方 zustand。</p>
      </div>
      <div className="card">
        <MinimalZustandPanel />
        <OfficialZustandPanel />
      </div>
    </section>
  )
}

function MinimalJotaiPanel() {
  const [count, setCount] = useMinimalAtom(minimalCountAtom)
  const [double] = useMinimalAtom(minimalDoubleAtom)

  return (
    <JotaiPanel
      badge="@minimal/jotai"
      title="Minimal"
      description="自制 minimal 版 jotai。"
      count={count}
      double={double}
      onInc={() => setCount(prev => prev + 1)}
      onReset={() => setCount(0)}
    />
  )
}

function OfficialJotaiPanel() {
  const [count, setCount] = useOfficialAtom(officialCountAtom)
  const [double] = useOfficialAtom(officialDoubleAtom)

  return (
    <JotaiPanel
      badge="jotai"
      title="Official"
      description="官方 npm:jotai。"
      count={count}
      double={double}
      onInc={() => setCount(prev => prev + 1)}
      onReset={() => setCount(0)}
    />
  )
}

function JotaiDemo() {
  useRenderTracker('Jotai Demo')

  return (
    <section className="block">
      <div className="block__header">
        <p className="eyebrow">jotai</p>
        <h1>Jotai demo</h1>
        <p className="note">使用 packages/jotai/src/minimal.js，对比官方 jotai 的 atom + useAtom。</p>
      </div>

      <div className="grid">
        <MinimalJotaiPanel />
        <OfficialJotaiPanel />
      </div>
    </section>
  )
}

function App() {
  useRenderTracker('App')

  return (
    <main className="layout">
      <ZustandDemo />
      <JotaiDemo />
    </main>
  )
}

export default App
