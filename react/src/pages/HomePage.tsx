import Header from '../components/Header'
import Hero from '../components/Hero'
import Products from '../components/Products'
import Partners from '../components/Partners'
import Contact from '../components/Contact'
import Footer from '../components/Footer'

const HomePage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Products />
      <Partners />
      <Contact />
      <Footer />
    </div>
  )
}

export default HomePage

