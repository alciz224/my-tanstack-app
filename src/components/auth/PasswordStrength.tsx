import * as React from 'react'
import { calculatePasswordStrength } from '@/lib/validation'

export interface PasswordStrengthProps {
  password: string
  showRequirements?: boolean
}

/**
 * Password strength indicator with visual bar and feedback
 */
export function PasswordStrength({
  password,
  showRequirements = true,
}: PasswordStrengthProps) {
  const strength = calculatePasswordStrength(password)

  if (!password) {
    return null
  }

  // Color based on level
  const colorClasses = {
    weak: 'bg-red-500',
    fair: 'bg-yellow-500',
    good: 'bg-blue-500',
    strong: 'bg-green-500',
  }

  const textColorClasses = {
    weak: 'text-red-600 dark:text-red-400',
    fair: 'text-yellow-600 dark:text-yellow-400',
    good: 'text-blue-600 dark:text-blue-400',
    strong: 'text-green-600 dark:text-green-400',
  }

  return (
    <div className="space-y-2">
      {/* Strength bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Password strength</span>
          <span className={`text-xs font-medium capitalize ${textColorClasses[strength.level]}`}>
            {strength.level}
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${colorClasses[strength.level]}`}
            style={{ width: `${strength.score}%` }}
          />
        </div>
      </div>

      {/* Requirements checklist */}
      {showRequirements && (
        <div className="space-y-1">
          <RequirementItem
            met={password.length >= 8}
            text="At least 8 characters"
          />
          <RequirementItem
            met={/[A-Z]/.test(password)}
            text="One uppercase letter"
          />
          <RequirementItem
            met={/[a-z]/.test(password)}
            text="One lowercase letter"
          />
          <RequirementItem met={/[0-9]/.test(password)} text="One number" />
          <RequirementItem
            met={/[^A-Za-z0-9]/.test(password)}
            text="One special character (optional)"
            optional
          />
        </div>
      )}
    </div>
  )
}

interface RequirementItemProps {
  met: boolean
  text: string
  optional?: boolean
}

function RequirementItem({ met, text, optional = false }: RequirementItemProps) {
  return (
    <div className="flex items-center gap-2 text-xs">
      {met ? (
        <svg
          className="w-4 h-4 text-green-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4 text-muted-foreground"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <span className={met ? 'text-foreground' : 'text-muted-foreground'}>
        {text}
        {optional && ' (recommended)'}
      </span>
    </div>
  )
}
