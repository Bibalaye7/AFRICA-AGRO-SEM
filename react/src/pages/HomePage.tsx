import PublicLayout from '../components/PublicLayout'
import Hero from '../components/Hero'
import ActivitiesTeaser from '../components/ActivitiesTeaser'
import Products from '../components/Products'
import ElevageTeaser from '../components/ElevageTeaser'
import EngraisTeaser from '../components/EngraisTeaser'
import WhyUs from '../components/WhyUs'
import CampaignCalendar from '../components/CampaignCalendar'
import Reservation from '../components/Reservation'
import Partners from '../components/Partners'
import Contact from '../components/Contact'

const HomePage = () => (
  <PublicLayout>
    <Hero />
    <ActivitiesTeaser />
    <Products />
    <EngraisTeaser />
    <ElevageTeaser />
    <WhyUs />
    <CampaignCalendar />
    <Reservation />
    <Partners />
    <Contact />
  </PublicLayout>
)

export default HomePage
