import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export default function Events() {
  const [events, setEvents] = useState([]);
  const [addedEvents, setAddedEvents] = useState({});
  const [attendedEvents, setAttendedEvents] = useState({});
  const [error, setError] = useState(undefined);

  useEffect(() => {
    eventsClick();
  }, []);

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
      setError(e.message);
    }
  };

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
  };

  return (
    <div>
      {error && <p>An error occurred: {error}</p>}
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
              {!addedEvents[id] && 
                <button onClick={() => sendEvent({
                  name,
                  "showDetails": { artist, venue, dateFormatted },
                  "status": "Wishlist",
                  "ticketmasterId": id
                }, 'wishlist')}>Add to Wishlist</button>
              }
              {addedEvents[id] && <p>Added ✔</p>}
              {!attendedEvents[id] && 
                <button onClick={() => sendEvent({
                  name,
                  "showDetails": { artist, venue, dateFormatted },
                  "status": "Attended",
                  "ticketmasterId": id
                }, 'attended')}>Attended</button>
              }
              {attendedEvents[id] && <p>Attended ✔</p>}
            </li>
          );
        })}
      </ul>
    </div>
  );
}