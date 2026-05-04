import type { AcademicDataAdapter } from './types';
import { LocalAcademicAdapter } from './local.adapter';
import { ApiAcademicAdapter } from './api.adapter';

export function getAcademicService(): AcademicDataAdapter {
  if (process.env.VITE_LOCAL_DATA === 'true' || process.env.NODE_ENV !== 'production') {
    return new LocalAcademicAdapter();
  }
  return new ApiAcademicAdapter();
}
