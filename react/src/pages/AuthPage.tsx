import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const AuthPage = () => {
  const navigate = useNavigate()
  const { configured, loading, user, role, isStaff, signIn, signUp, signOut } = useAuth()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (loading || (user && role === null)) return <div className="min-h-screen bg-gray-50" />
  if (user && isStaff) return <Navigate to="/tableau-de-bord" replace />

  const handleForgotPassword = async () => {
    if (!supabase) return
    if (!email) {
      setMessage('Saisissez d’abord votre adresse e-mail, puis cliquez sur « Mot de passe oublié ».')
      return
    }
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth` })
    setMessage(error ? error.message : 'Un lien de réinitialisation vous a été envoyé par e-mail.')
  }

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

    if (mode === 'signin') {
      setMessage('Connexion réussie. Redirection en cours...')
      setTimeout(() => navigate('/tableau-de-bord'), 500)
    } else {
      setMessage('Compte créé. Vérifiez votre adresse e-mail avant de vous connecter.')
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="Notre engagement">
        <div className="auth-story__image" />
        <div className="auth-story__shade" />
        <div className="auth-story__content">
          <p className="auth-eyebrow">L'excellence agricole africaine</p>
          <h1>Ensemble pour une<br />agriculture durable</h1>
          <p className="auth-story__intro">Connectez-vous à votre espace administrateur pour gérer la campagne agricole, les semences et les messages de nos visiteurs.</p>
          <ul className="auth-benefits">
            <li><span className="auth-benefit-icon">◌</span><span>Suivi de la campagne agricole</span></li>
            <li><span className="auth-benefit-icon">✣</span><span>Gestion des semences et récoltes</span></li>
            <li><span className="auth-benefit-icon">□</span><span>Messagerie des visiteurs</span></li>
            <li><span className="auth-benefit-icon">▥</span><span>Statistiques et rapports</span></li>
          </ul>
          <p className="auth-quote">« Une terre fertile aujourd'hui,<br />une meilleure alimentation demain »</p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-panel__leaves" aria-hidden="true">◢</div>
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="auth-card">
          <div className="auth-logo auth-logo--card" aria-label="Africa Agro Sem">
            <img src="/les_logos/logo-blanc.jpg" alt="Africa Agro Sem" />
          </div>
          <h2>{mode === 'signin' ? 'Connexion' : 'Créer un compte'}</h2>
          <p className="auth-card__subtitle">{mode === 'signin' ? "Accédez à votre espace d'administration" : 'Créez votre espace Africa Agro Sem'}</p>

          {user && !isStaff && (
            <div className="auth-alert">
              Vous êtes connecté ({user.email}), mais votre compte n’a pas encore accès au tableau de bord. Demandez à un administrateur de vous attribuer le rôle « agent » ou « admin ».
              <button type="button" onClick={() => signOut()} className="block mt-2 underline">Se déconnecter</button>
            </div>
          )}
          {!configured && <div className="auth-alert">Supabase n’est pas configuré. Ajoutez vos variables `.env.local` pour activer les comptes.</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === 'signup' && <label className="auth-field"><span>Nom complet</span><span className="auth-field__input"><input required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Votre nom complet" /></span></label>}
            <label className="auth-field">
              <span>Adresse e-mail</span>
              <span className="auth-field__input"><span className="auth-field__icon">♙</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Votre adresse e-mail" /></span>
            </label>
            <label className="auth-field">
              <span>Mot de passe</span>
              <span className="auth-field__input"><span className="auth-field__icon">▣</span><input required minLength={6} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Votre mot de passe" /><button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? '◉' : '◌'}</button></span>
            </label>
            <div className="auth-options"><span /><button type="button" onClick={handleForgotPassword}>Mot de passe oublié ?</button></div>
            {message && <p className="auth-message">{message}</p>}
            <button disabled={!configured || submitting} className="auth-submit">{submitting ? 'Traitement...' : mode === 'signin' ? 'Se connecter  →' : 'Créer mon compte  →'}</button>
          </form>
          <button type="button" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setMessage('') }} className="auth-switch">
            {mode === 'signin' ? 'Pas encore de compte ? Créer un compte' : 'Déjà inscrit ? Se connecter'}
          </button>
          <div className="auth-return"><span /> <Link to="/">⌂ &nbsp; Retour à ma page d’accueil</Link> <span /></div>
        </motion.div>
        <div className="auth-values" aria-hidden="true"><span>♧<small>Agriculture</small></span><i /><span>✣<small>Innovation</small></span><i /><span>♧<small>Partenariat</small></span></div>
      </section>
    </main>
  )
}

export default AuthPage
