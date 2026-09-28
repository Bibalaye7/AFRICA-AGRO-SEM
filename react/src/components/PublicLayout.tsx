import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'
import { whatsappLink } from '../data/seeds'

const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1">{children}</main>
    <Footer />
    <a
      href={whatsappLink('Bonjour Africa Agro Sem, je souhaite des informations sur vos semences.')}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Nous écrire sur WhatsApp"
      className="fixed bottom-5 right-5 z-40 w-14 h-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-lg hover:scale-105 transition-transform"
    >
      <i className="fa-brands fa-whatsapp text-3xl" aria-hidden="true" />
    </a>
  </div>
)

export default PublicLayout
