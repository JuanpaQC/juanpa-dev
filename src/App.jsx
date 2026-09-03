import Home from './pages/Home'
import './App.css'
import Navbar from './components/Navbar'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'
import TopFade from './components/TopFade'

function App() {
  return (
    <div className="min-h-screen bg-light-surface dark:bg-dark-background transition-colors duration-300">
      <TopFade />
      <Navbar />
      <main className="pt-15">
        <Home />
        <About />
        <Projects />
        <Contact />
      </main>
    </div>
  );
}

export default App
