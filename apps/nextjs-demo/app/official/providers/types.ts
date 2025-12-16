import type { createCounterStore } from '../stores/counter-store'

export type CounterStoreApi = ReturnType<typeof createCounterStore>
