import { getWebRequest } from '@tanstack/react-start/server';
import { LocalAdapter } from './local.adapter';
import { ApiAdapter } from './api.adapter';
import type { DataAdapter } from './types';

/**
 * Factory: creates a request-scoped DataAdapter.
 *
 * When LOCAL_DATA=true → returns LocalAdapter (in-memory mocks).
 * When LOCAL_DATA=false → returns ApiAdapter (forwards cookies to real API).
 *
 * Call this inside every server function handler to capture the current request.
 */
export function getDataService(): DataAdapter {
  if (process.env.LOCAL_DATA === 'true') {
    return new LocalAdapter();
  }
  return new ApiAdapter();
}
