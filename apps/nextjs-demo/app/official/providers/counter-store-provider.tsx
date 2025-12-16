'use client'

import type { ReactNode } from 'react'
import type { CounterState } from '../stores/counter-store'
import { useState } from 'react'
import { createCounterStore } from '../stores/counter-store'
import { CounterStoreContext } from './counter-store-context'

export function CounterStoreProvider({
  children,
  initialState,
}: {
  children: ReactNode
  initialState: CounterState
}) {
  const [store] = useState(() => createCounterStore(initialState))
  return (
    <CounterStoreContext value={store}>
      {children}
    </CounterStoreContext>
  )
}
