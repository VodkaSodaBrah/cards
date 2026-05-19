import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Tracker from './pages/Tracker'
import Benefits from './pages/Benefits'

export default function App() {
  const navStyle = {
    fontFamily: '"JetBrains Mono", monospace',
    fontSize: '11px',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    padding: '0 20px',
    background: '#1a1614',
    color: '#f4efe6',
    display: 'flex',
    alignItems: 'center',
    gap: '0',
    height: '44px',
    borderBottom: '2px solid #b8431f',
  }

  const linkBase = {
    color: '#f4efe6',
    textDecoration: 'none',
    padding: '0 16px',
    height: '44px',
    display: 'flex',
    alignItems: 'center',
    opacity: 0.6,
    transition: 'opacity 0.15s',
    borderBottom: '2px solid transparent',
    marginBottom: '-2px',
  }

  return (
    <BrowserRouter>
      <nav style={navStyle}>
        <span style={{ opacity: 0.35, marginRight: '16px', fontSize: '10px' }}>
          cards.childressdigital.com
        </span>
        <NavLink
          to="/"
          end
          style={({ isActive }) => ({
            ...linkBase,
            opacity: isActive ? 1 : 0.55,
            borderBottomColor: isActive ? '#b8431f' : 'transparent',
          })}
        >
          Tracker
        </NavLink>
        <NavLink
          to="/benefits"
          style={({ isActive }) => ({
            ...linkBase,
            opacity: isActive ? 1 : 0.55,
            borderBottomColor: isActive ? '#b8431f' : 'transparent',
          })}
        >
          Benefits
        </NavLink>
      </nav>

      <Routes>
        <Route path="/" element={<Tracker />} />
        <Route path="/benefits" element={<Benefits />} />
      </Routes>
    </BrowserRouter>
  )
}
