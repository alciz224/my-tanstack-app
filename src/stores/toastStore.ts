import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastStore {
  toasts: Array<Toast>
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
  clearAll: () => void
}

/**
 * Toast notification store
 * Manages global toast notifications
 */
export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substring(2, 11)
    const newToast: Toast = { ...toast, id }

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }))

    // Auto-dismiss after duration (default 5 seconds)
    const duration = toast.duration ?? 5000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      }, duration)
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }))
  },

  clearAll: () => {
    set({ toasts: [] })
  },
}))

/**
 * Helper functions for common toast types
 */
export const toast = {
  success: (title: string, message?: string, duration?: number) => {
    useToastStore
      .getState()
      .addToast({ type: 'success', title, message, duration })
  },

  error: (title: string, message?: string, duration?: number) => {
    useToastStore
      .getState()
      .addToast({ type: 'error', title, message, duration })
  },

  warning: (title: string, message?: string, duration?: number) => {
    useToastStore
      .getState()
      .addToast({ type: 'warning', title, message, duration })
  },

  info: (title: string, message?: string, duration?: number) => {
    useToastStore
      .getState()
      .addToast({ type: 'info', title, message, duration })
  },
}
