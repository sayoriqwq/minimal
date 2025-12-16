import { create as createMinimal } from '@minimal/zustand'
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

function App() {
  // 没有做好类型推断是这样的
  const minimalCount = useMinimalCounter((s: CounterState) => s.count)
  const minimalInc = useMinimalCounter((s: CounterState) => s.inc)

  const officialCount = useOfficialCounter(s => s.count)
  const officialInc = useOfficialCounter(s => s.inc)

  return (
    <>
      <h1>Zustand demo</h1>
      <div className="card">
        <button onClick={minimalInc}>
          @minimal/zustand count is
          {' '}
          {minimalCount}
        </button>

        <button onClick={officialInc}>
          zustand (official) count is
          {' '}
          {officialCount}
        </button>
      </div>
    </>
  )
}

export default App
