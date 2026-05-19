import { z } from 'zod'

/**
 * Environment variable validation.
 * LOCAL_DATA controls the adapter selection.
 * API_BASE_URL and API_KEY are required when using the real adapter.
 */
export const env = z
  .object({
    LOCAL_DATA: z
      .string()
      .transform((v) => v === 'true')
      .default('false'),
    LOCAL_DATA_PERSIST: z
      .string()
      .transform((v) => v === 'true')
      .optional(),
    API_BASE_URL: z.string().url().optional(),
    API_KEY: z.string().optional(),
  })
  .parse(process.env)
