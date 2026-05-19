/**
 * Auth Data Adapter Factory
 *
 * Returns LocalAuthAdapter or ApiAuthAdapter based on the VITE_LOCAL_DATA env var.
 * Follows the exact same pattern as geography, academic, and users factories.
 *
 * CRITICAL: The condition here MUST match isLocalMode() in auth.ts exactly.
 * Both use import.meta.env.VITE_LOCAL_DATA === 'true'.
 *
 * Call getAuthService() inside server function handlers, never at module top-level.
 */

import { LocalAuthAdapter } from './local.adapter'
import { ApiAuthAdapter } from './api.adapter'
import type { AuthDataAdapter } from './types'

/**
 * Check if we're in local data mode.
 * Exported so auth.ts can use the same check (single source of truth).
 */
export function isLocalDataMode(): boolean {
  return import.meta.env.VITE_LOCAL_DATA === 'true'
}

export function getAuthService(): AuthDataAdapter {
  if (isLocalDataMode()) {
    return new LocalAuthAdapter()
  }
  return new ApiAuthAdapter()
}
