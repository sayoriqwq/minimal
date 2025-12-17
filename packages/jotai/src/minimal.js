/**
 * jotai的核心：atom 的创建 & useAtom hook
 * atom: 状态的保存、读取、更新的[基本单元]
 * useAtom: for React，组件中使用 atom 的方式
 */

import { useEffect, useState } from 'react'

// dsl，描述 => 配置对象
export function atom(read, write) {
  // 派生atom
  if (typeof write === 'function') {
    return { read, write }
  }

  // 初始值，默认读写
  const config = {
    init: read,
    read: get => get(config),
    write: write || ((get, set, arg) => {
      if (typeof arg === 'function') {
        set(config, arg(get(config)))
      }
      else {
        set(config, arg)
      }
    }),
  }

  return config
}

// 运行时状态容器，atom -> atomState
const atomStateMap = new WeakMap()
function getAtomState(atom) {
  let atomState = atomStateMap.get(atom)
  if (!atomState) {
    atomState = {
      value: atom.init,
      listeners: new Set(),
      dependents: new Set(),
    }
    atomStateMap.set(atom, atomState)
  }
  return atomState
}

// 读取，依赖收集，缓存更新
function readAtom(atom) {
  const atomState = getAtomState(atom)
  const get = (a) => {
    if (a === atom) {
      // 出递归条件，读回了自己
      return atomState.value
    }
    const aState = getAtomState(a)
    // 当前atom 依赖 a，a变了需要通知当前atom更新
    aState.dependents.add(atom)
    // 读取别的atom，递归
    return readAtom(a)
  }

  const value = atom.read(get)
  // 读完以后把结果写回缓存
  atomState.value = value
  return value
}

function notify(atom) {
  const atomState = getAtomState(atom)
  atomState.dependents.forEach((d) => {
    if (d !== atom) {
      notify(d)
    }
  })
  atomState.listeners.forEach(listener => listener())
}

// 写入，触发通知
function writeAtom(atom, value) {
  const atomState = getAtomState(atom)
  const get = (a) => {
    const aState = getAtomState(a)
    return aState.value
  }

  const set = (a, v) => {
    if (a === atom) {
      atomState.value = v
      notify(atom)
      return
    }
    writeAtom(a, v)
  }
  atom.write(get, set, value)
}

// 把 atom 的订阅机制，桥接到 React 的 state 更新上
export function useAtom(atom) {
  const [value, setValue] = useState()
  useEffect(() => {
    const callback = () => setValue(readAtom(atom))

    const atomState = getAtomState(atom)
    atomState.listeners.add(callback)
    // 首次 value 从 undefined 同步到真实值
    callback()
    return () => atomState.listeners.delete(callback)
  }, [atom])

  const setAtom = (nextValue) => {
    writeAtom(atom, nextValue)
  }

  return [value, setAtom]
}
