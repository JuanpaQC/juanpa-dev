import Home from './pages/Home'
import './App.css'
import Navbar from './components/Navbar'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import TopFade from './components/TopFade'
import SmoothScroll from './components/SmoothScroll'
import SectionDivider from './components/SectionDivider'
import FeaturedCase from './components/FeaturedCase'

function App() {
  return (
    <div className="min-h-screen bg-light-surface dark:bg-dark-background transition-colors duration-300">
      {/* No pinta nada: monta Lenis y lo ata al ticker de GSAP. */}
      <SmoothScroll />
      <TopFade />
      <Navbar />
      <main className="pt-15">
        <Home />
        <SectionDivider />
        <About />
        <SectionDivider />
        <FeaturedCase />
        <SectionDivider />
        <Projects />
        <SectionDivider />
        <Contact />
      </main>
    </div>
  );
}

export default App
