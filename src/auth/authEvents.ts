/**
 * Cross-tab auth event synchronization
 * 
 * Allows tabs to broadcast auth events (login/logout) to each other so that:
 * - Logout in one tab can invalidate/redirect other tabs
 * - Login in one tab can refresh other tabs
 * 
 * Uses BroadcastChannel (modern) with localStorage fallback (older browsers).
 */

export type AuthEventType = 'login' | 'logout'

export interface AuthEvent {
  type: AuthEventType
  timestamp: number
}

// BroadcastChannel for modern browsers
const CHANNEL_NAME = 'auth-events'
let channel: BroadcastChannel | null = null

// Storage key for fallback
const STORAGE_KEY = 'auth:event'

// Event listeners registry
type AuthEventListener = (event: AuthEvent) => void
const listeners = new Set<AuthEventListener>()

/**
 * Initialize the cross-tab mechanism (called lazily on first subscribe)
 */
function initializeChannel() {
  if (typeof window === 'undefined') return // SSR guard

  // Try BroadcastChannel first
  if (typeof BroadcastChannel !== 'undefined') {
    try {
      channel = new BroadcastChannel(CHANNEL_NAME)
      channel.onmessage = (e: MessageEvent) => {
        const event = e.data as AuthEvent
        notifyListeners(event)
      }
    } catch (err) {
      console.warn('[authEvents] BroadcastChannel failed, using localStorage fallback')
      channel = null
    }
  }

  // Fallback: localStorage 'storage' event
  if (!channel) {
    window.addEventListener('storage', handleStorageEvent)
  }
}

/**
 * Handle localStorage storage event (fallback for older browsers)
 */
function handleStorageEvent(e: StorageEvent) {
  if (e.key !== STORAGE_KEY || !e.newValue) return

  try {
    const event = JSON.parse(e.newValue) as AuthEvent
    notifyListeners(event)
  } catch {
    // Invalid JSON, ignore
  }
}

/**
 * Notify all registered listeners of an auth event
 */
function notifyListeners(event: AuthEvent) {
  listeners.forEach((fn) => fn(event))
}

/**
 * Emit an auth event to all other tabs
 * 
 * @param type - The event type ('login' or 'logout')
 */
export function emitAuthEvent(type: AuthEventType) {
  if (typeof window === 'undefined') return // SSR guard

  const event: AuthEvent = {
    type,
    timestamp: Date.now(),
  }

  // Notify local listeners immediately (same tab)
  notifyListeners(event)

  // Send via BroadcastChannel if available
  if (channel) {
    channel.postMessage(event)
  } else {
    // Fallback: write to localStorage to trigger 'storage' event in other tabs
    localStorage.setItem(STORAGE_KEY, JSON.stringify(event))
    // Optionally remove immediately to keep storage clean
    localStorage.removeItem(STORAGE_KEY)
  }
}

/**
 * Subscribe to auth events from other tabs
 * 
 * @param listener - Callback invoked when an auth event is received
 * @returns Unsubscribe function
 */
export function subscribeAuthEvents(listener: AuthEventListener): () => void {
  if (typeof window === 'undefined') return () => {} // SSR guard

  // Lazy init on first subscribe
  if (listeners.size === 0) {
    initializeChannel()
  }

  listeners.add(listener)

  // Return unsubscribe function
  return () => {
    listeners.delete(listener)

    // Cleanup if no more listeners
    if (listeners.size === 0) {
      if (channel) {
        channel.close()
        channel = null
      } else {
        window.removeEventListener('storage', handleStorageEvent)
      }
    }
  }
}
