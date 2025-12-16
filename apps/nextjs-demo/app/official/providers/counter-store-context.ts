import type { CounterStoreApi } from './types'

import { createContext } from 'react'

export const CounterStoreContext = createContext<CounterStoreApi | undefined>(undefined)
