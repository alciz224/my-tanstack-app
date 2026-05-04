import type { GeographyDataAdapter } from './types';
import { LocalGeographyAdapter } from './local.adapter';
import { ApiGeographyAdapter } from './api.adapter';

export function getGeographyService(): GeographyDataAdapter {
  // Use local mock data by default for now if LOCAL_DATA is true, otherwise use API
  if (process.env.VITE_LOCAL_DATA === 'true' || process.env.NODE_ENV !== 'production') {
    return new LocalGeographyAdapter();
  }
  return new ApiGeographyAdapter();
}
