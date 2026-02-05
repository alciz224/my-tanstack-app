import * as React from 'react'

export interface FormFieldProps {
  label: string
  error?: string
  helperText?: string
  required?: boolean
  children: React.ReactNode
  htmlFor?: string
}

/**
 * Reusable form field wrapper with label, error display, and helper text
 * Properly supports aria-describedby for accessibility
 */
export function FormField({
  label,
  error,
  helperText,
  required = false,
  children,
  htmlFor,
}: FormFieldProps) {
  const errorId = htmlFor ? `${htmlFor}-error` : undefined
  const helperId = htmlFor ? `${htmlFor}-helper` : undefined

  return (
    <div className="space-y-2">
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p id={errorId} className="text-sm text-destructive flex items-center gap-1">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          {error}
        </p>
      )}
      {!error && helperText && (
        <p id={helperId} className="text-sm text-muted-foreground">
          {helperText}
        </p>
      )}
    </div>
  )
}
