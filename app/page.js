import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Categories from './components/Categories'
import FeaturedBooks from './components/FeaturedBooks'
import Services from './components/Services'
import News from './components/News'
import About from './components/About'
import Footer from './components/Footer'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <Categories />
      <FeaturedBooks />
      <Services />
      <News />
      <About />
      <Footer />
    </main>
  )
}
