import { Link, useLocation } from 'react-router';

export default function Header({ setIsLoggedIn }) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  const signOut = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  return (
    <header>
      <nav>
        {!isHome && (
          <>
            <Link to="/events">Upcoming Events</Link>
            <Link to="/shows">My Shows</Link>
            <Link to="/artists">My Artists</Link>
          </>
        )}
        <button onClick={() => signOut()}>Sign out</button>
      </nav>
    </header>
  );
}