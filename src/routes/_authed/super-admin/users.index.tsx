import { Link, createFileRoute } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useServerFn } from '@tanstack/react-start'
import { useState } from 'react'
import {CheckCircle, Edit, Loader2, Mail, Phone, Plus, Search, Trash2, User, XCircle} from 'lucide-react'
import type { AdminUser, CreateAdminUserInput } from '@/server/data/users/types'
import { getUsersFn } from '@/server/api/users'
import { createUserFn, deleteUserFn,  updateUserFn,} from '@/server/api/users-mutations'

import { toast } from '@/stores/toastStore'

export const Route = createFileRoute('/_authed/super-admin/users/')({
  component: AdminUsersPage,
})

function AdminUsersPage() {
  const queryClient = useQueryClient()
  const getUsers = useServerFn(getUsersFn)
  const createUser = useServerFn(createUserFn)
  const updateUser = useServerFn(updateUserFn)
  const deleteUser = useServerFn(deleteUserFn)

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editing, setEditing] = useState<AdminUser | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [search, setSearch] = useState('')

  const { data: users, isLoading } = useQuery({
    queryKey: ['users', 'list'],
    queryFn: () => getUsers(),
  })

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['users', 'list'] })

  const createMut = useMutation({
    mutationFn: async (data: CreateAdminUserInput) => { await createUser({ data }); invalidate() },
    onSuccess: () => { toast.success('Utilisateur créé avec succès'); setIsCreateOpen(false) },
    onError: (e: any) => toast.error(e.message),
  })
  const updateMut = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AdminUser> }) => { await updateUser({ data: { id, data } }); invalidate() },
    onSuccess: () => { toast.success('Utilisateur modifié avec succès'); setEditing(null) },
    onError: (e: any) => toast.error(e.message),
  })
  const deleteMut = useMutation({
    mutationFn: async (id: string) => { await deleteUser({ data: { id } }); invalidate() },
    onSuccess: () => { toast.success('Utilisateur supprimé avec succès'); setDeleteConfirm(null) },
    onError: (e: any) => { toast.error(e.message); setDeleteConfirm(null) },
  })

  const filtered = (users ?? []).filter((u) => {
    const name = `${u.first_name} ${u.last_name}`.toLowerCase()
    const email = String(u.email).toLowerCase()
    const q = search.toLowerCase()
    if (q && !name.includes(q) && !email.includes(q) && !u.id.toLowerCase().includes(q)) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Gestion des Utilisateurs
          </h1>
          <p className="text-muted-foreground mt-1">
            Consultez, modifiez et gérez les accès des utilisateurs du système.
          </p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium transition-colors hover:bg-primary/90 btn-shine hover-scale">
          <Plus className="w-5 h-5" />
          <span>Nouvel utilisateur</span>
        </button>
      </div>

      {/* Filters and Search Bar */}
      <div className="bg-card border border-border rounded-lg p-4 flex flex-col sm:flex-row gap-4 hover-lift">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Rechercher par nom, identifiant ou email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-input border-none rounded-lg py-2.5 pl-10 pr-4 text-foreground focus:ring-2 focus:ring-ring focus:outline-none transition-shadow"
          />
        </div>
        <button onClick={() => setSearch('')} className="px-4 py-2.5 text-foreground/80 hover:text-foreground hover:bg-muted/70 rounded-lg transition-colors font-medium">
          Réinitialiser
        </button>
      </div>

      {/* Users Data Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden shadow-sm hover-lift">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                  Contact
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
                  Statut
                </th>
                <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wide text-foreground/80 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto" />
                  </td>
                </tr>
              )}
              {filtered.length === 0 && !isLoading && (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              )}
              {filtered.map((user) => (
                <tr key={user.id} className="hover:bg-muted/40 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary group-hover:bg-primary/20 transition-colors">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <Link
                          to="/super-admin/users/$userId"
                          params={{ userId: user.id }}
                          className="font-semibold text-foreground hover:text-primary transition-colors"
                        >
                          {user.first_name} {user.last_name}
                        </Link>
                        <div className="text-xs text-muted-foreground font-mono mt-0.5">
                          {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 text-foreground/80">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">{user.email ?? '—'}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm">{user.phone}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.is_active ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-success/15 text-success">
                        <CheckCircle className="w-3.5 h-3.5" />
                        Actif
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wide bg-muted text-muted-foreground">
                        <XCircle className="w-3.5 h-3.5" />
                        Inactif
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setEditing(user)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md transition-colors hover-scale" title="Modifier cet utilisateur">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button onClick={() => setDeleteConfirm(user.id)} className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-colors hover-scale" title="Supprimer cet utilisateur">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/10">
          <span className="text-sm text-muted-foreground">
            Affichage de{' '}
            <span className="font-medium text-foreground">
              {filtered.length ? 1 : 0}
            </span>{' '}
            à{' '}
            <span className="font-medium text-foreground">
              {filtered.length}
            </span>{' '}
            sur{' '}
            <span className="font-medium text-foreground">
              {users?.length || 0}
            </span>{' '}
            utilisateurs
          </span>
          <div className="flex gap-1">
            <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors" disabled>
              Précédent
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground font-medium shadow-sm transition-colors btn-shine hover-scale">
              1
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hover-scale">
              2
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors hover-scale">
              3
            </button>
            <button className="px-3 py-1.5 text-sm rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              Suivant
            </button>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isCreateOpen && (
        <UserModal
          isSubmitting={createMut.isPending}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(data) => createMut.mutate(data)}
        />
      )}

      {/* Edit Modal */}
      {editing && (
        <UserModal
          initial={editing}
          isSubmitting={updateMut.isPending}
          onClose={() => setEditing(null)}
          onSubmit={(data) => updateMut.mutate({ id: editing.id, data })}
        />
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <ConfirmDelete
          isSubmitting={deleteMut.isPending}
          onCancel={() => setDeleteConfirm(null)}
          onConfirm={() => deleteMut.mutate(deleteConfirm)}
        />
      )}
    </div>
  )
}

function UserModal({ initial, isSubmitting, onClose, onSubmit }: {
  initial?: AdminUser; isSubmitting: boolean; onClose: () => void; onSubmit: (data: any) => void
}) {
  const isEdit = !!initial
  const [firstName, setFirstName] = useState(initial?.first_name || '')
  const [lastName, setLastName] = useState(initial?.last_name || '')
  const [email, setEmail] = useState(initial?.email || '')
  const [phone, setPhone] = useState(initial?.phone || '')
  const [isActive, setIsActive] = useState(initial?.is_active ?? true)
  const [isStaff, setIsStaff] = useState(initial?.is_staff ?? false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      onSubmit({
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone: phone || null,
        is_active: isActive,
        is_staff: isStaff,
      })
    } else {
      onSubmit({
        first_name: firstName,
        last_name: lastName,
        email,
        phone: phone || undefined,
        is_active: isActive,
        is_staff: isStaff,
      })
    }
  }

  const inputBase = 'w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-xl border border-border bg-card shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-base font-semibold text-foreground">{isEdit ? 'Modifier' : 'Nouvel'} utilisateur</h2>
        </div>
        <form onSubmit={handleSubmit} noValidate className="px-6 pb-6 pt-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prénom" htmlFor="firstName">
              <input
                id="firstName"
                name="firstName"
                title="Prénom"
                placeholder="Prénom"
                type="text"
                className={inputBase}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Field>
            <Field label="Nom" htmlFor="lastName">
              <input
                id="lastName"
                name="lastName"
                title="Nom"
                placeholder="Nom"
                type="text"
                className={inputBase}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Field>
          </div>
          <Field label="Email" htmlFor="email">
            <input
              id="email"
              name="email"
              title="Email"
              placeholder="Email"
              type="email"
              className={inputBase}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
          <Field label="Téléphone" htmlFor="phone">
            <input
              id="phone"
              name="phone"
              title="Téléphone"
              placeholder="Téléphone"
              type="tel"
              className={inputBase}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Field>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Compte actif</label>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              aria-label={isActive ? 'Désactiver le compte' : 'Activer le compte'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-success' : 'bg-muted'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-foreground">Personnel (staff)</label>
            <button
              type="button"
              onClick={() => setIsStaff(!isStaff)}
              aria-label={isStaff ? 'Retirer le statut personnel' : 'Attribuer le statut personnel'}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isStaff ? 'bg-primary' : 'bg-muted'}`}
            >
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isStaff ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50">Annuler</button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50">{isSubmitting ? 'En cours...' : isEdit ? 'Modifier' : 'Créer'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-foreground">{label}</label>
      {children}
    </div>
  )
}

function ConfirmDelete({ isSubmitting, onCancel, onConfirm }: { isSubmitting: boolean; onCancel: () => void; onConfirm: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card shadow-xl p-6">
        <h3 className="text-sm font-semibold text-foreground mb-2">Confirmer la suppression</h3>
        <p className="text-xs text-muted-foreground mb-4">Cette action est irréversible.</p>
        <div className="flex justify-end gap-2">
          <button onClick={onCancel} disabled={isSubmitting} className="rounded-lg border border-input bg-background px-4 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50">Annuler</button>
          <button onClick={onConfirm} disabled={isSubmitting} className="rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white hover:bg-destructive/90 disabled:opacity-50">{isSubmitting ? 'Suppression...' : 'Supprimer'}</button>
        </div>
      </div>
    </div>
  )
}
