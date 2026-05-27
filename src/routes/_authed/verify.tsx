import { createFileRoute } from '@tanstack/react-router'
import * as React from 'react'
import {
  sendVerificationCodeFn,
  confirmVerificationCodeFn,
  getVerificationStatusFn,
  type VerificationStatus,
} from '@/lib/auth-client'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { toast } from '@/stores/toastStore'

export const Route = createFileRoute('/_authed/verify')({
  component: VerifyPage,
})

function VerifyPage() {
  const [status, setStatus] = React.useState<VerificationStatus | null>(null)
  const [loadingStatus, setLoadingStatus] = React.useState(true)
  const [verifyType, setVerifyType] = React.useState<'email' | 'phone'>('email')
  const [code, setCode] = React.useState('')
  const [sending, setSending] = React.useState(false)
  const [confirming, setConfirming] = React.useState(false)
  const [codeSent, setCodeSent] = React.useState(false)
  const [globalError, setGlobalError] = React.useState<string | null>(null)
  const [codeFieldError, setCodeFieldError] = React.useState<string | null>(null)

  React.useEffect(() => {
    loadStatus()
  }, [])

  const loadStatus = async () => {
    setLoadingStatus(true)
    try {
      const result = await getVerificationStatusFn()
      setStatus(result)
      if (!result.email_verified) setVerifyType('email')
      else if (!result.phone_verified) setVerifyType('phone')
    } catch {
      setGlobalError('Impossible de charger le statut de vérification.')
    } finally {
      setLoadingStatus(false)
    }
  }

  const handleSendCode = async () => {
    setGlobalError(null)
    setSending(true)
    try {
      await sendVerificationCodeFn({ type: verifyType })
      setCodeSent(true)
      setCode('')
      toast.success('Code envoyé', 'Code de vérification envoyé.')
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setSending(false)
    }
  }

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setGlobalError(null)
    if (!code.trim()) {
      setCodeFieldError('Ce champ est requis')
      return
    }
    setCodeFieldError(null)
    setConfirming(true)
    try {
      await confirmVerificationCodeFn({ type: verifyType, code: code.trim() })
      toast.success('Vérification réussie', 'Votre compte a été vérifié avec succès.')
      setCodeSent(false)
      setCode('')
      loadStatus()
    } catch (err) {
      setGlobalError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setConfirming(false)
    }
  }

  if (loadingStatus) {
    return (
      <div className="mx-auto max-w-lg py-12 px-4">
        <div className="bg-card border border-border rounded-lg p-6 shadow-lg flex items-center justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg py-12 px-4">
      <div className="bg-card border border-border rounded-lg p-6 shadow-lg space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            Vérification du compte
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Vérifiez votre email et votre numéro de téléphone pour sécuriser votre compte.
          </p>
        </div>

        {globalError && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {globalError}
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-md border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Email</p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status?.email_verified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {status?.email_verified ? 'Vérifié' : 'Non vérifié'}
            </span>
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-4">
            <div>
              <p className="text-sm font-medium text-foreground">Téléphone</p>
            </div>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                status?.phone_verified
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700'
              }`}
            >
              {status?.phone_verified ? 'Vérifié' : 'Non vérifié'}
            </span>
          </div>
        </div>

        {(!status?.email_verified || !status?.phone_verified) && (
          <div className="space-y-4 rounded-md border border-border p-4">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-foreground">
                Que souhaitez-vous vérifier ?
              </label>
              <select
                value={verifyType}
                onChange={(e) => {
                  setVerifyType(e.target.value as 'email' | 'phone')
                  setCodeSent(false)
                  setCode('')
                  setGlobalError(null)
                  setCodeFieldError(null)
                }}
                className="flex h-9 rounded-md border border-input bg-background px-3 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                {!status?.email_verified && (
                  <option value="email">Email</option>
                )}
                {!status?.phone_verified && (
                  <option value="phone">Téléphone</option>
                )}
              </select>
            </div>

            {!codeSent ? (
              <button
                type="button"
                onClick={handleSendCode}
                disabled={sending}
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
              >
                {sending && <LoadingSpinner size="sm" className="mr-2" />}
                Envoyer le code
              </button>
            ) : (
              <form onSubmit={handleConfirmCode} className="space-y-3">
                <div className="space-y-2">
                  <label htmlFor="code" className="block text-sm font-medium text-foreground">
                    Code de vérification
                    <span className="text-destructive ml-1">*</span>
                  </label>
                  <input
                    id="code"
                    type="text"
                    autoComplete="one-time-code"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value)
                      setCodeFieldError(null)
                    }}
                    className="w-full px-3 py-2 rounded-lg bg-background text-foreground border border-input focus:outline-none focus:ring-2 focus:ring-ring transition-colors disabled:opacity-50"
                    placeholder="000000"
                    disabled={confirming}
                  />
                  {codeFieldError && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      {codeFieldError}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={confirming}
                    className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                  >
                    {confirming && <LoadingSpinner size="sm" className="mr-2" />}
                    Confirmer
                  </button>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={sending}
                    className="text-sm text-primary hover:underline"
                  >
                    Renvoyer le code
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {status?.email_verified && status?.phone_verified && (
          <div className="rounded-md bg-green-50 p-4 text-center text-sm text-green-700">
            Votre compte est entièrement vérifié.
          </div>
        )}
      </div>
    </div>
  )
}
