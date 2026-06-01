import { useEffect } from 'react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Header({ setIsLoggedIn, isLoggedIn }) {
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  const [error, setError] = useState(undefined);

  const signOut = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));

    try {
      const res = await fetch(`${API_BASE_URL}/auth/delete`, {
        method: "DELETE",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ email: payload.email })
      })

      if (res.ok) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/');
    }

    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <header>
      <nav>
        {!isHome &&
          <>
            <Link to="/events">Upcoming Events</Link>
            <Link to="/shows">My Shows</Link>
            <Link to="/artists">My Artists</Link>
          </>
        }
        {isLoggedIn && 
        <>
          <button onClick={() => signOut()}>Sign out</button>
          <button onClick={() => deleteAccount()}>Delete Account</button>
        </>
        }
        {error && <p>{error}</p>}
      </nav>
    </header>
  );
}