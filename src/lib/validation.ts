/**
 * Client-side validation utilities for forms
 * Lightweight, no dependencies - just plain TypeScript
 */

export interface ValidationResult {
  isValid: boolean
  error?: string
}

/**
 * Email validation
 */
export function validateEmail(value: string): ValidationResult {
  if (!value) {
    return { isValid: true } // Optional field
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(value)) {
    return { isValid: false, error: 'Please enter a valid email address' }
  }

  return { isValid: true }
}

/**
 * Phone validation (Guinea format: +224 followed by 9 digits)
 */
export function validatePhone(value: string): ValidationResult {
  if (!value) {
    return { isValid: true } // Optional field
  }

  const phoneRegex = /^\+224[0-9]{9}$/
  if (!phoneRegex.test(value)) {
    return {
      isValid: false,
      error: 'Phone must be in format: +224XXXXXXXXX (9 digits after +224)',
    }
  }

  return { isValid: true }
}

/**
 * Password validation with detailed requirements
 */
export function validatePassword(value: string): ValidationResult {
  if (!value) {
    return { isValid: false, error: 'Password is required' }
  }

  if (value.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' }
  }

  if (!/[A-Z]/.test(value)) {
    return {
      isValid: false,
      error: 'Password must contain at least one uppercase letter',
    }
  }

  if (!/[a-z]/.test(value)) {
    return {
      isValid: false,
      error: 'Password must contain at least one lowercase letter',
    }
  }

  if (!/[0-9]/.test(value)) {
    return { isValid: false, error: 'Password must contain at least one number' }
  }

  return { isValid: true }
}

/**
 * Password confirmation validation
 */
export function validatePasswordMatch(
  password: string,
  confirm: string,
): ValidationResult {
  if (!confirm) {
    return { isValid: false, error: 'Please confirm your password' }
  }

  if (password !== confirm) {
    return { isValid: false, error: 'Passwords do not match' }
  }

  return { isValid: true }
}

/**
 * Validate that at least one contact method (email or phone) is provided
 */
export function validateAtLeastOneContact(
  email: string,
  phone: string,
): ValidationResult {
  if (!email && !phone) {
    return {
      isValid: false,
      error: 'Please provide at least an email or phone number',
    }
  }

  return { isValid: true }
}

/**
 * Required field validation
 */
export function validateRequired(value: string, fieldName: string): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` }
  }

  return { isValid: true }
}

/**
 * Calculate password strength (0-100)
 */
export interface PasswordStrength {
  score: number // 0-100
  level: 'weak' | 'fair' | 'good' | 'strong'
  feedback: Array<string>
}

export function calculatePasswordStrength(password: string): PasswordStrength {
  let score = 0
  const feedback: Array<string> = []

  if (!password) {
    return { score: 0, level: 'weak', feedback: ['Password is required'] }
  }

  // Length scoring
  if (password.length >= 8) {
    score += 20
  } else {
    feedback.push('Use at least 8 characters')
  }

  if (password.length >= 12) {
    score += 10
  }

  if (password.length >= 16) {
    score += 10
  }

  // Character variety scoring
  if (/[a-z]/.test(password)) {
    score += 15
  } else {
    feedback.push('Add lowercase letters')
  }

  if (/[A-Z]/.test(password)) {
    score += 15
  } else {
    feedback.push('Add uppercase letters')
  }

  if (/[0-9]/.test(password)) {
    score += 15
  } else {
    feedback.push('Add numbers')
  }

  if (/[^A-Za-z0-9]/.test(password)) {
    score += 15
    feedback.push('Great! You used special characters')
  } else {
    feedback.push('Consider adding special characters (!@#$%)')
  }

  // Determine level
  let level: 'weak' | 'fair' | 'good' | 'strong'
  if (score < 40) {
    level = 'weak'
  } else if (score < 60) {
    level = 'fair'
  } else if (score < 80) {
    level = 'good'
  } else {
    level = 'strong'
  }

  return { score, level, feedback }
}

/**
 * Format phone number as user types (auto-add +224 prefix)
 */
export function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')

  // If starts with 224, add + prefix
  if (digits.startsWith('224')) {
    return '+' + digits.slice(0, 12) // Max 12 chars (+224 + 9 digits)
  }

  // If user hasn't typed prefix yet, auto-add it
  if (digits.length > 0 && !digits.startsWith('224')) {
    return '+224' + digits.slice(0, 9)
  }

  return value
}

/**
 * Trim whitespace from all form fields
 */
export function trimFormData<T extends Record<string, any>>(data: T): T {
  const trimmed = { ...data }
  for (const key in trimmed) {
    if (typeof trimmed[key] === 'string') {
      trimmed[key] = trimmed[key].trim()
    }
  }
  return trimmed
}
