
import { useState, useEffect } from "react"
import type { ToastActionElement, ToastProps } from "@/components/ui/toast"

const TOAST_LIMIT = 1

let count = 0
function generateId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  duration?: number;
  dismiss?: () => void;
}

interface State {
    toasts: ToasterToast[];
}

const toastStore = {
  state: {
    toasts: [],
  } as State,
  listeners: [] as Array<(state: State) => void>,
  
  getState: () => toastStore.state,
  
  setState: (nextState: State | ((state: State) => State)) => {
    if (typeof nextState === 'function') {
      toastStore.state = nextState(toastStore.state)
    } else {
      toastStore.state = { ...toastStore.state, ...nextState }
    }
    
    toastStore.listeners.forEach(listener => listener(toastStore.state))
  },
  
  subscribe: (listener: (state: State) => void) => {
    toastStore.listeners.push(listener)
    return () => {
      toastStore.listeners = toastStore.listeners.filter(l => l !== listener)
    }
  }
}

export const toast = ({ ...props }: Omit<ToasterToast, 'id'>) => {
  const id = generateId()

  const update = (props: ToasterToast) =>
    toastStore.setState((state) => ({
      ...state,
      toasts: state.toasts.map((t) =>
        t.id === id ? { ...t, ...props } : t
      ),
    }))

  const dismiss = () => toastStore.setState((state) => ({
    ...state,
    toasts: state.toasts.filter((t) => t.id !== id),
  }))

  toastStore.setState((state) => ({
    ...state,
    toasts: [
      { ...props, id, dismiss },
      ...state.toasts,
    ].slice(0, TOAST_LIMIT),
  }))

  return {
    id,
    dismiss,
    update,
  }
}

export function useToast() {
  const [state, setState] = useState(toastStore.getState())
  
  useEffect(() => {
    const unsubscribe = toastStore.subscribe((state) => {
      setState(state)
    })
    
    return unsubscribe
  }, [])
  
  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = []

    state.toasts.forEach((t) => {
      if (t.duration === Infinity) {
        return
      }

      const timeout = setTimeout(() => {
        t.dismiss?.()
      }, t.duration || 5000)

      timeouts.push(timeout)
    })

    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [state.toasts])

  return {
    toast,
    toasts: state.toasts,
    dismiss: (toastId?: string) => {
        if (toastId) {
            const toastToDismiss = toastStore.getState().toasts.find(t => t.id === toastId);
            toastToDismiss?.dismiss?.();
        } else {
            toastStore.getState().toasts.forEach(t => t.dismiss?.());
        }
    }
  }
}
