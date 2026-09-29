import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'

const AuthPage = () => {
  const navigate = useNavigate()
  const { loading, user, needsSetup, setupAllowed, unavailable, signIn, setup } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (loading) return <div className="min-h-screen bg-gray-50" />
  if (user) return <Navigate to="/tableau-de-bord" replace />

  // Tant qu'aucun compte n'existe, la page sert à créer l'administrateur (depuis l'ordinateur local uniquement).
  const isSetup = needsSetup

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setMessage('')
    setSubmitting(true)
    const result = isSetup ? await setup(fullName, email, password) : await signIn(email, password)
    setSubmitting(false)
    if (result.error) {
      setMessage(result.error)
      return
    }
    navigate('/tableau-de-bord')
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
          <h2>{isSetup ? 'Premier accès' : 'Connexion'}</h2>
          <p className="auth-card__subtitle">{isSetup ? 'Créez le compte administrateur du site' : "Accédez à votre espace d'administration"}</p>

          {unavailable && <div className="auth-alert">L’espace professionnel n’est pas encore disponible en ligne. Merci de réessayer plus tard.</div>}
          {isSetup && !setupAllowed && (
            <div className="auth-alert">Aucun compte n’existe encore. Le compte administrateur doit être créé depuis l’ordinateur où le site est installé (http://localhost:5173/auth).</div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {isSetup && <label className="auth-field"><span>Nom complet</span><span className="auth-field__input"><input required value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Votre nom complet" /></span></label>}
            <label className="auth-field">
              <span>Adresse e-mail</span>
              <span className="auth-field__input"><span className="auth-field__icon">♙</span><input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Votre adresse e-mail" /></span>
            </label>
            <label className="auth-field">
              <span>Mot de passe</span>
              <span className="auth-field__input"><span className="auth-field__icon">▣</span><input required minLength={isSetup ? 8 : undefined} type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={isSetup ? 'Au moins 8 caractères' : 'Votre mot de passe'} /><button type="button" className="auth-password-toggle" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}>{showPassword ? '◉' : '◌'}</button></span>
            </label>
            {!isSetup && <div className="auth-options"><span /><button type="button" onClick={() => setMessage('Demandez à un administrateur de réinitialiser votre accès depuis l’onglet « Équipe » du tableau de bord.')}>Mot de passe oublié ?</button></div>}
            {message && <p className="auth-message">{message}</p>}
            <button disabled={submitting || Boolean(unavailable) || (isSetup && !setupAllowed)} className="auth-submit">{submitting ? 'Traitement...' : isSetup ? 'Créer le compte administrateur  →' : 'Se connecter  →'}</button>
          </form>
          <div className="auth-return"><span /> <Link to="/">⌂ &nbsp; Retour à ma page d’accueil</Link> <span /></div>
        </motion.div>
        <div className="auth-values" aria-hidden="true"><span>♧<small>Agriculture</small></span><i /><span>✣<small>Innovation</small></span><i /><span>♧<small>Partenariat</small></span></div>
      </section>
    </main>
  )
}

export default AuthPage
