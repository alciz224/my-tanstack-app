import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'

export interface PasswordInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  showStrengthIndicator?: boolean
}

/**
 * Password input with visibility toggle
 */
export function PasswordInput({
  showStrengthIndicator = false,
  className = '',
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = React.useState(false)

  return (
    <div className="relative">
      <input
        {...props}
        type={showPassword ? 'text' : 'password'}
        className={`w-full px-3 py-2 pr-10 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${className}`}
        autoComplete={props.autoComplete || 'current-password'}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground transition-colors"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <EyeOff className="w-5 h-5" />
        ) : (
          <Eye className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}
