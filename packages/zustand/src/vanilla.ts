/**
 * 一个状态管理库需要什么功能？
 * 1. 存储/获取状态
 * 2. 更新状态
 * 3. [订阅]状态变化
 */

// TODO: 类型体操以支持setState reload

export interface StoreApi<T> {
  getState: () => T
  setState: (partial: Partial<T> | ((state: T) => Partial<T>), replace?: boolean) => void
  subscribe: (listener: (state: T, prevState: T) => void) => () => void
  getInitialState: () => T
}

export type StateCreator<T> = (
  set: StoreApi<T>['setState'],
  get: StoreApi<T>['getState'],
  api: StoreApi<T>,
) => T

export function createStoreImpl<T>(createState: StateCreator<T>): StoreApi<T> {
  type TState = ReturnType<typeof createState>
  type listener = (state: TState, prevState: TState) => void

  let state!: TState
  const listeners = new Set<listener>()

  const getState = () => state

  const setState: StoreApi<TState>['setState'] = (partial, replace) => {
    const nextState
      = typeof partial === 'function'
        ? partial(state)
        : partial

    if (Object.is(nextState, state))
      return

    const prevState = state
    const isObject = typeof nextState === 'object' && nextState !== null

    state = (replace ?? !isObject ? nextState : { ...state, ...nextState }) as TState

    listeners.forEach(listener => listener(state, prevState))
  }

  const subscribe = (listener: listener) => {
    listeners.add(listener)
    return () => listeners.delete(listener)
  }

  let initialState!: T
  const api = {
    getState,
    setState,
    subscribe,
    getInitialState: () => initialState,
  }

  initialState = (state = createState(setState, getState, api))

  return api
}

export function createStore<TState>(): (createState: StateCreator<TState>) => StoreApi<TState>
export function createStore<TState>(createState: StateCreator<TState>): StoreApi<TState>
export function createStore<TState>(createState?: StateCreator<TState>) {
  return createState ? createStoreImpl(createState) : createStoreImpl
}
