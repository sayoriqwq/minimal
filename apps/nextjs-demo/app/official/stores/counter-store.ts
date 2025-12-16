import { createStore } from 'zustand/vanilla'

export interface CounterState {
  count: number
}

export interface CounterActions {
  incrementCount: () => void
  decrementCount: () => void
  setCount: (count: number) => void
}

export interface CounterStore extends CounterState, CounterActions {}

export const defaultInitState: CounterState = {
  count: 0,
}

export function createCounterStore(initState: CounterState = defaultInitState) {
  return createStore<CounterStore>()(set => ({
    ...initState,
    incrementCount: () => set(state => ({ count: state.count + 1 })),
    decrementCount: () => set(state => ({ count: state.count - 1 })),
    setCount: count => set({ count }),
  }))
}
