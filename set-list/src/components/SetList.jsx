import { useEffect, useState } from 'react'
import Form from './Form';
import Header from './Header'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export default function SetList() {
  const [error, setError] = useState(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [showCreateAccountForm, setShowCreateAccountForm] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [events, setEvents] = useState([])
  const [addedEvents, setAddedEvents] = useState({})
  const [attendedEvents, setAttendedEvents] = useState({})

  const showInputs = (e) => {
    if (e.target.id === "create") {
      setShowCreateAccountForm(!showCreateAccountForm);
      setShowLoginForm(false)
    } 
    if (e.target.id === "login") {
      setShowLoginForm(!showLoginForm)
      setShowCreateAccountForm(false);
    } 
  }

  useEffect(() => {
    setIsLoggedIn(localStorage.getItem('token'));
  },[])

  const eventsClick = async () => {
    if (!token) return;
    try {
      const [eventsRes, showsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/events`),
        fetch(`${API_BASE_URL}/show`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      const eventsData = await eventsRes.json();
      const showsData = await showsRes.json();

      if (eventsData) {
        setEvents(eventsData._embedded.events);
      }
      
      const wishlist = {};
      const attended = {};
      showsData.forEach(show => {
        if (show.status === 'Wishlist') wishlist[show.ticketmasterId] = true;
        if (show.status === 'Attended') attended[show.ticketmasterId] = true;
      });

      setAddedEvents(wishlist);
      setAttendedEvents(attended);
    } catch (e) {
      setError(e.message)
    }
  }

  useEffect(() => {
    eventsClick();
  }, [])

  const sendEvent = async (eventData, type) => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/show`, {
        method: 'POST',
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(eventData)
      });
      if (res.ok) {
        if (type === 'wishlist') {
          setAddedEvents(prev => ({ ...prev, [eventData.ticketmasterId]: true }));
        } else if (type === 'attended') {
          setAttendedEvents(prev => ({ ...prev, [eventData.ticketmasterId]: true }));
        }
      } else {
        const msg = await res.text();
        setError(msg);
        return;
      }
      
    } catch (e) {
      setError(e.message);
    }
  }
  

  return (
    <>
    <Header setIsLoggedIn={setIsLoggedIn}/>
    <h1>SetList 🎵</h1>
      {isLoggedIn && 
        <>
        <h2>Welcome</h2>
          <button onClick={() => eventsClick()}>Upcoming Events</button>
          <button>My Events</button>
          <button>My Artists</button>
          <div>
            <ul>
              {events.map((event) => {
                
                const id = event.id,
                      name = event.name,
                      date = new Date(event.dates?.start?.localDate + 'T00:00:00'),
                      dateFormatted = new Intl.DateTimeFormat('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      }).format(date),
                      artist = event._embedded?.attractions?.[0]?.name,
                      venue = event._embedded?.venues?.[0]?.name,
                      img = event.images[0]?.url;
                return (
                  <li key={id}>
                    <img src={img} alt="" style={{width: "500px"}}/>
                    <div>{name}</div>
                    <div>{dateFormatted}</div>
                    <div>{venue}</div>
                    {!addedEvents[event.id] && 
                      <button onClick={() => sendEvent({
                        name,
                        "showDetails": {
                          artist,
                          venue,
                          dateFormatted,
                        },
                        "status": "Wishlist",
                        "ticketmasterId":id
                      }, 'wishlist')}>Add to Wishlist</button>
                    }
                    {addedEvents[id] && <p>Added ✔</p>}
                    {!attendedEvents[id] && <button onClick={() => sendEvent({
                      name,
                        "showDetails": {
                          artist,
                          venue,
                          dateFormatted,
                        },
                        "status": "Attended",
                        "ticketmasterId": id
                    }, 'attended')}>Attended</button>}
                    {attendedEvents[id] && <p>Attended ✔</p>}
                  </li>
                )
              })}
            </ul>
          </div>
        </>
        
      }
      {!isLoggedIn && 
        <>
          <button id="create" onClick={(e) => showInputs(e)}>Create an account</button>
          <button id="login" onClick={(e) => showInputs(e)}>Login</button>

          {showCreateAccountForm && !isAccountCreated && <Form action={`${API_BASE_URL}/auth/signup`} type="create" submitText="Create account" setIsAccountCreated={setIsAccountCreated}/>}
          {isAccountCreated && <p>Account created! Please login.</p>}
          {showLoginForm && <Form action={`${API_BASE_URL}/auth/login`} type="login" submitText="Login to account" setIsLoggedIn={setIsLoggedIn}/>}
        </>
      }
      
      {/* { isLoading && <p>Loading...</p> } */}
      { error && <p>An error occurred: {error}</p> }
    </>
  )
}