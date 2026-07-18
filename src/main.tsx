import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'

import Landing from './pages/Landing'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import EditPhoto from './pages/EditPhoto'
import EditVideo from './pages/EditVideo'
import LuxuryCar from './pages/LuxuryCar'
import ChangeScene from './pages/ChangeScene'
import Creations from './pages/Creations'
import Credits from './pages/Credits'
import Account from './pages/Account'
import Affiliate from './pages/Affiliate'
import Generating from './pages/Generating'
import Result from './pages/Result'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import AuthGuard from './components/layout/AuthGuard'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/app" element={<AuthGuard><Dashboard /></AuthGuard>} />
        <Route path="/app/edit-photo" element={<AuthGuard><EditPhoto /></AuthGuard>} />
        <Route path="/app/edit-video" element={<AuthGuard><EditVideo /></AuthGuard>} />
        <Route path="/app/luxury-car" element={<AuthGuard><LuxuryCar /></AuthGuard>} />
        <Route path="/app/change-scene" element={<AuthGuard><ChangeScene /></AuthGuard>} />
        <Route path="/app/creations" element={<AuthGuard><Creations /></AuthGuard>} />
        <Route path="/app/credits" element={<AuthGuard><Credits /></AuthGuard>} />
        <Route path="/app/account" element={<AuthGuard><Account /></AuthGuard>} />
        <Route path="/app/affiliate" element={<AuthGuard><Affiliate /></AuthGuard>} />
        <Route path="/app/generating/:id" element={<AuthGuard><Generating /></AuthGuard>} />
        <Route path="/app/result/:id" element={<AuthGuard><Result /></AuthGuard>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
