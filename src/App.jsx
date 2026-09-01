import Home from './pages/Home'
import './App.css'
import Navbar from './components/Navbar'
import About from './pages/About'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

function App() {
  return (
    <div className="min-h-screen bg-light-surface dark:bg-dark-background transition-colors duration-300">
      <div className="fixed top-0 left-0 w-full h-12 z-40 bg-white/20 dark:bg-dark-background/20 backdrop-blur-md pointer-events-none"></div>
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
