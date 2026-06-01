import { useState } from 'react'
import { useNavigate } from 'react-router';

export default function Form({action, type, submitText, setIsLoggedIn, setIsAccountCreated}) {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    try {
      const res = await fetch(action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData))
      })

      if (res.ok) {
        if (type === 'login') {
          const { token } = await res.json();
          localStorage.setItem('token', token);
          setIsLoggedIn(token);
        }
        if (type === 'create') {
          setIsAccountCreated(true);
        }
        navigate('/');
      }

      if (!res.ok) {
        const msg = await res.text();
        setError(msg);
        return;
      }

    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p class="error">{error}</p>}
      <div className='formWrapper'>
        <label htmlFor="email" required>Email</label>
        <input type="email" id="email" name="email" required autoComplete="on"/>
      </div>
      
      <div className='formWrapper'>
        <label htmlFor="password" required>Password</label>
        <input type="password" id="password" name="password" required />
      </div>
      
      <button type="submit">{submitText}</button>
    </form>
  )
}