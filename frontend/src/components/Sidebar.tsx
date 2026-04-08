import { Link, useLocation } from 'react-router'

const menuItemsKezeles = [
  { label: 'Szárnyak',  path: '/wings' ,       icon: '🏨'},
  { label: 'Személyzet',       path: '/staff',          icon: '👨🏻‍💼'},
  { label: 'Vendégek',  path: '/guests',          icon: '👨‍👨‍👦‍👦' },
  { label: 'Szobák',    path: '/rooms',     icon: '🛌' },
  { label: 'Foglalások',    path: '/bookings',     icon: '📅' },
  { label: 'Szolgáltatáskérések',    path: '/services',     icon: '🛎️' },
];
const menuItemsRendszer = [
  { label: 'Szimuláció',   path: '/simulation',   icon: '⚡' },
];


export default function Sidebar() {
  const location = useLocation();

  return (
    <aside>
      <div className="nav-section-label">Kezelés</div>
      {menuItemsKezeles.map(item => {
        const isActive = location.pathname === item.path;
        return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none'
              }}
              className='nav-link'
            >
              <div className={`nav-btn ${isActive ? 'active' : 'none'}`}>
                <span className='icon'>{item.icon}</span> {item.label}
              </div>
            </Link>
        );
      })}
      <div className="nav-section-label">Rendszer</div>
      {menuItemsRendszer.map(item => {
        const isActive = location.pathname === item.path;
        return (
            <Link
              key={item.path}
              to={item.path}
              style={{
                textDecoration: 'none'
              }}
              className='nav-link'
            >
              <div className={`nav-btn ${isActive ? 'active' : 'none'}`}>
                <span className='icon'>{item.icon}</span> {item.label}
              </div>
            </Link>
        );
      })}
    </aside>
  );
}