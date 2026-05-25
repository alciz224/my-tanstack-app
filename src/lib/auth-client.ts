import type { AuthResult, LoginInput, RegisterInput, SelectRoleInput, SelectRoleResult } from '@/server/auth'

function isLocalDataMode(): boolean {
  return import.meta.env.VITE_LOCAL_DATA === 'true'
}

export async function loginFn(data: LoginInput): Promise<AuthResult> {
  if (isLocalDataMode()) {
    const { localLoginFn } = await import('@/server/auth')
    return localLoginFn({ data })
  }

  try {
    const csrfRes = await fetch('/api/v2/auth/csrf/', { credentials: 'include' })
    if (!csrfRes.ok) throw new Error(`Failed to get CSRF token (${csrfRes.status})`)
    const csrfData = await csrfRes.json()
    const csrfToken = csrfData?.data?.csrf_token
    if (!csrfToken) throw new Error('CSRF token not found in response')

    const res = await fetch('/api/v2/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''
    try { responseData = contentType.includes('application/json') ? await res.json() : null } catch {}

    if (!res.ok) {
      const bodyText = responseData ? '' : await res.text().catch(() => '')
      const result: AuthResult = {
        success: false,
        error: responseData?.message || bodyText || `Login failed (${res.status})`,
        errorCode: responseData?.error?.code,
      }
      if (res.status === 429) {
        const retryAfterHeader = res.headers.get('Retry-After')
        result.retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60
      } else if (res.status === 400 && responseData?.error?.details) {
        result.fieldErrors = responseData.error.details
      }
      return result
    }
    return { success: true, user: responseData?.data?.user }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error during login' }
  }
}

export async function registerFn(data: RegisterInput): Promise<AuthResult> {
  if (isLocalDataMode()) {
    const { localRegisterFn } = await import('@/server/auth')
    return localRegisterFn({ data })
  }

  try {
    const csrfRes = await fetch('/api/v2/auth/csrf/', { credentials: 'include' })
    if (!csrfRes.ok) throw new Error(`Failed to get CSRF token (${csrfRes.status})`)
    const csrfData = await csrfRes.json()
    const csrfToken = csrfData?.data?.csrf_token
    if (!csrfToken) throw new Error('CSRF token not found in response')

    const res = await fetch('/api/v2/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''
    try { responseData = contentType.includes('application/json') ? await res.json() : null } catch {}

    if (!res.ok) {
      const bodyText = responseData ? '' : await res.text().catch(() => '')
      const result: AuthResult = {
        success: false,
        error: responseData?.message || bodyText || `Registration failed (${res.status})`,
        errorCode: responseData?.error?.code,
      }
      if (res.status === 429) {
        const retryAfterHeader = res.headers.get('Retry-After')
        result.retryAfter = retryAfterHeader ? parseInt(retryAfterHeader, 10) : 60
      } else if (res.status === 400 && responseData?.error?.details) {
        result.fieldErrors = responseData.error.details
      } else if (res.status === 409) {
        result.fieldErrors = { email: [responseData?.message || 'An account with this email already exists'] }
      }
      return result
    }
    return { success: true, user: responseData?.data?.user }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error during registration' }
  }
}

export async function selectRoleFn(data: SelectRoleInput): Promise<SelectRoleResult> {
  if (isLocalDataMode()) {
    const { localSelectRoleFn } = await import('@/server/auth')
    return localSelectRoleFn({ data })
  }

  try {
    const csrfRes = await fetch('/api/v2/auth/csrf/', { credentials: 'include' })
    if (!csrfRes.ok) throw new Error(`Failed to get CSRF token (${csrfRes.status})`)
    const csrfData = await csrfRes.json()
    const csrfToken = csrfData?.data?.csrf_token
    if (!csrfToken) throw new Error('CSRF token not found in response')

    const res = await fetch('/api/v2/auth/select-role/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-CSRFToken': csrfToken },
      credentials: 'include',
      body: JSON.stringify(data),
    })

    let responseData: any = null
    const contentType = res.headers.get('content-type') || ''
    try { responseData = contentType.includes('application/json') ? await res.json() : null } catch {}

    if (!res.ok) {
      const bodyText = responseData ? '' : await res.text().catch(() => '')
      return { success: false, error: responseData?.message || bodyText || `Role selection failed (${res.status})`, errorCode: responseData?.error?.code }
    }
    return { success: true, user: responseData?.data?.user }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error during role selection', errorCode: 'NETWORK_ERROR' }
  }
}

export async function logoutFn(): Promise<{ success: boolean; error?: string }> {
  if (isLocalDataMode()) {
    const { localLogoutFn } = await import('@/server/auth')
    return localLogoutFn()
  }

  try {
    const csrfRes = await fetch('/api/v2/auth/csrf/', { credentials: 'include' })
    let csrfToken = ''
    if (csrfRes.ok) {
      try { const csrfData = await csrfRes.json(); csrfToken = csrfData?.data?.csrf_token || '' } catch {}
    }

    const headers: HeadersInit = { 'Content-Type': 'application/json' }
    if (csrfToken) headers['X-CSRFToken'] = csrfToken as string

    const res = await fetch('/api/v2/auth/logout/', { method: 'POST', headers, credentials: 'include' })
    if (!res.ok) {
      let responseData: any = null
      const contentType = res.headers.get('content-type') || ''
      try { responseData = contentType.includes('application/json') ? await res.json() : null } catch {}
      return { success: false, error: responseData?.message || `Logout failed (${res.status})` }
    }
    return { success: true }
  } catch (err: any) {
    return { success: false, error: err?.message || 'Network error during logout' }
  }
}
