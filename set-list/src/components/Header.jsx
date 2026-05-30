
export default function Header({setIsLoggedIn}) {
  const signOut = () => {
    const token = localStorage.getItem('token');
    if (token) {
      localStorage.removeItem('token');
      setIsLoggedIn(false);
    }
  }
  return (
    <header>
      <nav>
        <button onClick={() => signOut()}>Sign out</button>
      </nav>
    </header>
  )
}