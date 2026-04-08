import { BrowserRouter, Route, Routes } from 'react-router'
import './App.css'
import Sidebar from './components/Sidebar'
import SimulationPage from './pages/SimulationPage'
import WingsPage from './pages/WingsPage'
import StaffPage from './pages/StaffPage'
import GuestsPage from './pages/GuestsPage'
import RoomsPage from './pages/RoomsPage'
import BookingsPage from './pages/BookingsPage'
import ServicesPage from './pages/ServicesPage'

function App() {

  return (
    <BrowserRouter>
      <div>
        <header>
          <div className="logo">Medi<span>Core</span></div>
          <div className="header-meta">
            <span className="status-dot"></span> H2 in-memory · Spring Boot
          </div>
        </header>
        <div className="workspace">
          <Sidebar />
          <main>
            <Routes>
              <Route path="/wings"  element={<WingsPage />} />
              <Route path="/staff"  element={<StaffPage />} />
              <Route path="/guests"  element={<GuestsPage />} />
              <Route path="/rooms"  element={<RoomsPage />} />
              <Route path="/bookings"  element={<BookingsPage />} />
              <Route path="/services"  element={<ServicesPage />} />

              <Route path="/simulation"   element={<SimulationPage />} />
              <Route path="*"  element={<div>Válassz menüpontot</div>} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
