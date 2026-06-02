import { useEffect, useState } from 'react'
import Form from './Form';
import Header from './Header'
import { Link, Outlet, useLocation } from 'react-router';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function SetList() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [error, setError] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);

  const showInputs = (e) => {
    if (e.target.id === "create") {
      setShowCreateAccountForm(!showCreateAccountForm);
      setShowLoginForm(false);
    } 
    if (e.target.id === "login") {
      setShowLoginForm(!showLoginForm);
      setShowCreateAccountForm(false);
    } 
  }

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token'));
  }, []);

  return (
    <>
      <Header setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn}/>
      <main>
        <h1>Set List 🎵</h1>
        {isLoggedIn && 
          <>
            {isHome && (
              <div className="homePageLinks">
                <h2>Welcome</h2>
                <Link to="/events">Upcoming Events</Link>
                <Link to="/shows">My Shows</Link>
                <Link to="/artists">My Artists</Link>
              </div>
            )}
            <Outlet />
          </>
        }
        {!isLoggedIn && 
          <>
            <button id="create" onClick={(e) => showInputs(e)}>Create an account</button>
            <button id="login" onClick={(e) => showInputs(e)}>Login</button>

            {showCreateAccountForm && !isAccountCreated && <Form action={`${API_BASE_URL}/auth/signup`} type="create" submitText="Create account" setIsAccountCreated={setIsAccountCreated}/>}
            {isAccountCreated && <p className="success">Account created! Please login.</p>}
            {showLoginForm && <Form action={`${API_BASE_URL}/auth/login`} type="login" submitText="Login to account" setIsLoggedIn={setIsLoggedIn} setIsAccountCreated={setIsAccountCreated}/>}
          </>
        }
        {error && <p>An error occurred: {error}</p>}
      </main>
    </>
  );
}