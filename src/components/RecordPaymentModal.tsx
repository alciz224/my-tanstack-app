import { useState } from 'react'
import { DollarSign, Receipt, Search, User, X } from 'lucide-react'
import { useRouter } from '@tanstack/react-router'
import type { FeeSummary, SchoolFee } from '@/server/data/finance/types'
import { createPaymentFn, getSchoolFeesFn } from '@/server/api/finance'
import { getStudentsFn } from '@/server/api/students'

interface RecordPaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RecordPaymentModal({
  isOpen,
  onClose,
}: RecordPaymentModalProps) {
  const router = useRouter()
  const [step, setStep] = useState<'search' | 'select-fee' | 'payment'>(
    'search',
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStudent, setSelectedStudent] = useState<{
    id: string
    name: string
    class: string
  } | null>(null)
  const [availableFees, setAvailableFees] = useState<Array<SchoolFee>>([])
  const [selectedFee, setSelectedFee] = useState<SchoolFee | null>(null)

  const [paymentData, setPaymentData] = useState({
    amount_paid: 0,
    payment_date: new Date().toISOString().split('T')[0],
    payment_method: 'CASH' as
      | 'CASH'
      | 'BANK_TRANSFER'
      | 'MOBILE_MONEY'
      | 'CHECK',
    reference_number: '',
    notes: '',
  })

  if (!isOpen) return null

  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    try {
      const students = await getStudentsFn({ data: { search: searchQuery } })
      if (students.length > 0) {
        const student = students[0]
        setSelectedStudent({
          id: student.id,
          name: student.full_name,
          class: student.class_name,
        })

        const fees = await getSchoolFeesFn({ data: 'sy-2' })
        setAvailableFees(
          fees.filter(
            (f) => f.school_year_level_id === student.school_year_level_id,
          ),
        )
        setStep('select-fee')
      }
    } catch (err) {
      setError('Aucun élève trouvé')
    }
  }

  const handleSelectFee = (fee: SchoolFee) => {
    setSelectedFee(fee)
    setPaymentData((prev) => ({ ...prev, amount_paid: fee.amount }))
    setStep('payment')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedStudent || !selectedFee) return

    setError(null)
    setIsSubmitting(true)

    try {
      await createPaymentFn({
        data: {
          student_enrollment_id: selectedStudent.id,
          school_fee_id: selectedFee.id,
          amount_paid: paymentData.amount_paid,
          payment_date: paymentData.payment_date,
          payment_method: paymentData.payment_method,
          reference_number: paymentData.reference_number || undefined,
        },
      })
      onClose()
      resetForm()
      router.invalidate()
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors de l'enregistrement",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setStep('search')
    setSearchQuery('')
    setSelectedStudent(null)
    setAvailableFees([])
    setSelectedFee(null)
    setPaymentData({
      amount_paid: 0,
      payment_date: new Date().toISOString().split('T')[0],
      payment_method: 'CASH',
      reference_number: '',
      notes: '',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-GN', {
      style: 'currency',
      currency: 'GNF',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-background rounded-xl shadow-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="bg-primary px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <DollarSign className="w-5 h-5 text-primary-foreground" />
            <h2 className="text-white font-bold text-lg">
              Enregistrer un paiement
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps indicator */}
        <div className="px-6 py-3 bg-muted/30 flex items-center gap-2 text-sm">
          <span className={step === 'search' ? 'font-bold text-primary' : ''}>
            1. Rechercher
          </span>
          <span className="text-muted-foreground">→</span>
          <span
            className={
              step === 'select-fee'
                ? 'font-bold text-primary'
                : step === 'payment'
                  ? 'font-bold text-primary'
                  : 'text-muted-foreground'
            }
          >
            2. Sélectionner frais
          </span>
          <span className="text-muted-foreground">→</span>
          <span
            className={
              step === 'payment'
                ? 'font-bold text-primary'
                : 'text-muted-foreground'
            }
          >
            3. Paiement
          </span>
        </div>

        {/* Content */}
        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 'search' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Rechercher un élève
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                      placeholder="Nom ou matricule..."
                      className="w-full pl-9 pr-4 py-2.5 bg-input rounded-lg focus:ring-2 focus:ring-ring"
                    />
                  </div>
                  <button
                    onClick={handleSearch}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium"
                  >
                    Rechercher
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 'select-fee' && selectedStudent && (
            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium text-foreground">
                    {selectedStudent.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {selectedStudent.class}
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Sélectionner le frais à payer
                </label>
                <div className="space-y-2">
                  {availableFees.map((fee) => (
                    <button
                      key={fee.id}
                      onClick={() => handleSelectFee(fee)}
                      className="w-full p-3 text-left bg-card border border-border rounded-lg hover:border-primary/50 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">
                          {fee.id}
                        </span>
                        <span className="font-bold text-primary">
                          {formatCurrency(fee.amount)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Échéance:{' '}
                        {new Date(fee.due_date).toLocaleDateString('fr-FR')}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setStep('search')}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                ← Changer d'élève
              </button>
            </div>
          )}

          {step === 'payment' && selectedFee && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Frais sélectionné
                </p>
                <p className="font-medium text-foreground">{selectedFee.id}</p>
                <p className="text-lg font-bold text-primary">
                  {formatCurrency(selectedFee.amount)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Montant payé <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  value={paymentData.amount_paid}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      amount_paid: parseInt(e.target.value) || 0,
                    })
                  }
                  min={0}
                  max={selectedFee.amount}
                  className="w-full bg-input rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-ring"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Date de paiement
                  </label>
                  <input
                    type="date"
                    value={paymentData.payment_date}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        payment_date: e.target.value,
                      })
                    }
                    className="w-full bg-input rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-ring"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">
                    Mode de paiement
                  </label>
                  <select
                    value={paymentData.payment_method}
                    onChange={(e) =>
                      setPaymentData({
                        ...paymentData,
                        payment_method: e.target.value as any,
                      })
                    }
                    className="w-full bg-input rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-ring"
                  >
                    <option value="CASH">Espèces</option>
                    <option value="BANK_TRANSFER">Virement bancaire</option>
                    <option value="MOBILE_MONEY">Mobile Money</option>
                    <option value="CHECK">Chèque</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Référence (optionnel)
                </label>
                <input
                  type="text"
                  value={paymentData.reference_number}
                  onChange={(e) =>
                    setPaymentData({
                      ...paymentData,
                      reference_number: e.target.value,
                    })
                  }
                  placeholder="N° reçu, transaction..."
                  className="w-full bg-input rounded-lg py-2.5 px-4 focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep('select-fee')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  ← Retour
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || paymentData.amount_paid <= 0}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
