import type { CounterStore } from '../stores/counter-store'
import { use } from 'react'
import { useStore } from 'zustand'
import { CounterStoreContext } from './counter-store-context'

export function useCounterStore<T>(selector: (store: CounterStore) => T): T {
  const store = use(CounterStoreContext)
  if (!store)
    throw new Error('useCounterStore must be used within CounterStoreProvider')

  return useStore(store, selector)
}
