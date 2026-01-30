import './App.css'

import Home from './pages/Home.tsx'

import NavBar from './pages/NavBar.tsx'
import Footer from './pages/Footer.tsx'
import { AuthProvider } from './contexts/AuthContext'

function App() {
  return (
    <>
      <div>
        <AuthProvider>
          <NavBar />
          <Home />
          <Footer />
        </AuthProvider>
      </div>
    </>
  )
}

export default App
