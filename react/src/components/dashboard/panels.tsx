import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { api } from '../../lib/api'
import type { User } from '../../contexts/AuthContext'

type ContactMessage = { id: string; name: string; email: string; message: string; created_at: string }
type TeamMember = User & { created_at: string }

const fmtDate = (d: string) => new Date(d.replace(' ', 'T') + (d.includes('Z') ? '' : 'Z')).toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })

function Panel({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
      {children}
    </section>
  )
}

const ErrorNote = ({ text }: { text: string }) =>
  text ? <p className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-800 text-sm" role="alert">{text}</p> : null

// ---------- Messages du formulaire de contact ----------

export function MessagesPanel() {
  const [messages, setMessages] = useState<ContactMessage[] | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api<ContactMessage[]>('messages').then(setMessages, (err) => setError(err.message))
  }, [])

  return (
    <Panel title={`Messages reçus${messages ? ` (${messages.length})` : ''}`}>
      <ErrorNote text={error} />
      {messages?.length === 0 && <p className="text-center text-gray-500 py-8">Aucun message pour le moment. Ils arrivent ici depuis le formulaire « Contactez-nous ».</p>}
      <ul className="divide-y">
        {messages?.map((m) => (
          <li key={m.id} className="py-4">
            <p className="font-semibold text-gray-900">
              {m.name} <span className="font-normal text-gray-500">· <a href={`mailto:${m.email}`} className="text-agro-green">{m.email}</a> · {fmtDate(m.created_at)}</span>
            </p>
            <p className="text-sm text-gray-700 mt-1 whitespace-pre-line">{m.message}</p>
          </li>
        ))}
      </ul>
    </Panel>
  )
}

// ---------- Équipe (administrateurs) ----------

export function TeamPanel({ currentUser }: { currentUser: User }) {
  const [members, setMembers] = useState<TeamMember[]>([])
  const [error, setError] = useState('')
  const [form, setForm] = useState({ full_name: '', email: '', password: '', role: 'agent' })
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState('')

  const load = () => api<TeamMember[]>('users').then(setMembers, (err) => setError(err.message))
  useEffect(() => {
    load()
  }, [])

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    setDone('')
    try {
      await api('users', { method: 'POST', body: form })
      setDone(`Compte créé pour ${form.email}. Transmettez-lui son mot de passe provisoire.`)
      setForm({ full_name: '', email: '', password: '', role: 'agent' })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Création impossible.')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async (m: TeamMember) => {
    if (!window.confirm(`Supprimer le compte de ${m.full_name} (${m.email}) ?`)) return
    try {
      await api(`users/${m.id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Suppression impossible.')
    }
  }

  return (
    <div className="grid lg:grid-cols-5 gap-6">
      <div className="lg:col-span-3">
        <Panel title={`Comptes de l’équipe (${members.length})`}>
          <ul className="divide-y">
            {members.map((m) => (
              <li key={m.id} className="py-3 flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-gray-900">{m.full_name}{m.id === currentUser.id && <span className="text-gray-500 font-normal"> (vous)</span>}</p>
                  <p className="text-sm text-gray-500">{m.email} · {m.role === 'admin' ? 'Administrateur' : 'Agent'}</p>
                </div>
                {m.id !== currentUser.id && (
                  <button onClick={() => handleDelete(m)} className="p-2 text-gray-400 hover:text-red-600" aria-label={`Supprimer le compte de ${m.full_name}`}>
                    <i className="fa-solid fa-trash-can" aria-hidden="true" />
                  </button>
                )}
              </li>
            ))}
          </ul>
          <p className="text-xs text-gray-500 mt-4">
            Mot de passe oublié par un membre : supprimez son compte puis recréez-le avec un nouveau mot de passe provisoire.
          </p>
        </Panel>
      </div>
      <div className="lg:col-span-2">
        <Panel title="Ajouter un membre">
          <form onSubmit={handleAdd} className="space-y-4">
            <div>
              <label className="form-label" htmlFor="u-name">Nom complet</label>
              <input id="u-name" required value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label" htmlFor="u-email">E-mail</label>
              <input id="u-email" required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="form-input" />
            </div>
            <div>
              <label className="form-label" htmlFor="u-pass">Mot de passe provisoire</label>
              <input id="u-pass" required minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="form-input" placeholder="Au moins 8 caractères" />
            </div>
            <div>
              <label className="form-label" htmlFor="u-role">Rôle</label>
              <select id="u-role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="form-input">
                <option value="agent">Agent : saisie des lots et distributions</option>
                <option value="admin">Administrateur : gère aussi l’équipe</option>
              </select>
            </div>
            <ErrorNote text={error} />
            {done && <p className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm" role="status">{done}</p>}
            <button type="submit" disabled={busy} className="w-full py-3 rounded-lg bg-agro-green text-white font-semibold disabled:opacity-50">
              {busy ? 'Création…' : 'Créer le compte'}
            </button>
          </form>
        </Panel>
      </div>
    </div>
  )
}

// ---------- Changement de mot de passe ----------

export function PasswordForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (form.next !== form.confirm) return setError('Les deux nouveaux mots de passe ne correspondent pas.')
    setBusy(true)
    setError('')
    try {
      await api('auth/password', { method: 'POST', body: { current: form.current, next: form.next } })
      onDone()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Modification impossible.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="form-label" htmlFor="pw-current">Mot de passe actuel</label>
        <input id="pw-current" type="password" required value={form.current} onChange={(e) => setForm({ ...form, current: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="pw-next">Nouveau mot de passe</label>
        <input id="pw-next" type="password" required minLength={8} value={form.next} onChange={(e) => setForm({ ...form, next: e.target.value })} className="form-input" />
      </div>
      <div>
        <label className="form-label" htmlFor="pw-confirm">Confirmer le nouveau mot de passe</label>
        <input id="pw-confirm" type="password" required minLength={8} value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} className="form-input" />
      </div>
      <ErrorNote text={error} />
      <button type="submit" disabled={busy} className="w-full py-3 rounded-lg bg-agro-green text-white font-semibold disabled:opacity-50">
        {busy ? 'Enregistrement…' : 'Changer le mot de passe'}
      </button>
    </form>
  )
}
