import type { StateCreator, StoreApi } from './vanilla'
import { useSyncExternalStore } from 'react'
import { createStore } from './vanilla'

type ReadonlyStoreApi<T> = Pick<StoreApi<T>, 'getState' | 'subscribe' | 'getInitialState'>

const identity = <T>(v: T) => v

export function useStore<TState, Slice>(api: ReadonlyStoreApi<TState>, selector: (state: TState) => Slice = identity as any) {
  const slice = useSyncExternalStore(
    api.subscribe,
    () => selector(api.getState()),
    () => selector(api.getInitialState()),
  )

  return slice
}

export function create<TState>(createState: StateCreator<TState>) {
  const api = createStore(createState)
  const useBoundStore = <Slice>(selector?: (state: TState) => Slice) => useStore(api, selector)
  return Object.assign(useBoundStore, api)
}
