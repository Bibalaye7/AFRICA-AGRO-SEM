import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'

const AuthPage = () => {
  const navigate = useNavigate()
  const { configured, loading, user, signIn, signUp } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="min-h-screen bg-gray-50" />
  if (user) return <Navigate to="/" replace />

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)
    const result = mode === 'signin'
      ? await signIn(email, password)
      : await signUp(email, password, fullName)
    setSubmitting(false)

    if (result.error) {
      setMessage(result.error)
      return
    }

    setMessage(mode === 'signin'
      ? 'Connexion réussie. Redirection en cours...'
      : 'Compte créé. Vérifiez votre adresse e-mail avant de vous connecter.')
    if (mode === 'signin') setTimeout(() => navigate('/'), 500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="flex-1 pt-32 pb-20 px-4">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8"
        >
          <p className="text-sm font-semibold tracking-widest text-agro-light uppercase mb-3">Espace visiteur</p>
          <h1 className="text-3xl font-bold text-agro-green mb-3">
            {mode === 'signin' ? 'Ravi de vous revoir' : 'Créer votre compte'}
          </h1>
          <p className="text-gray-600 mb-8">
            {mode === 'signin'
              ? 'Connectez-vous pour retrouver votre espace Africa Agro SEM.'
              : 'Inscrivez-vous pour suivre vos échanges et demandes.'}
          </p>

          {!configured && (
            <div className="mb-6 rounded-lg bg-amber-50 border border-amber-200 p-4 text-sm text-amber-800">
              Supabase n’est pas configuré. Ajoutez les variables indiquées dans `.env.local` pour activer les comptes.
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <label className="block text-sm font-medium text-gray-700">
                Nom complet
                <input required value={fullName} onChange={(event) => setFullName(event.target.value)} className="auth-input" />
              </label>
            )}
            <label className="block text-sm font-medium text-gray-700">
              Adresse e-mail
              <input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} className="auth-input" />
            </label>
            <label className="block text-sm font-medium text-gray-700">
              Mot de passe
              <input required minLength={6} type="password" value={password} onChange={(event) => setPassword(event.target.value)} className="auth-input" />
            </label>
            {message && <p className="text-sm text-gray-700 bg-gray-100 rounded-lg p-3">{message}</p>}
            <button disabled={!configured || submitting} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? 'Traitement...' : mode === 'signin' ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <button
            type="button"
            onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage('') }}
            className="mt-6 w-full text-sm text-agro-green hover:underline"
          >
            {mode === 'signin' ? 'Pas encore de compte ? Créer un compte' : 'Déjà inscrit ? Se connecter'}
          </button>
          <Link to="/" className="block mt-4 text-center text-sm text-gray-500 hover:text-agro-green">Retour au site</Link>
        </motion.section>
      </main>
      <Footer />
    </div>
  )
}

export default AuthPage
