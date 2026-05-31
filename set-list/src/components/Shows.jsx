import { useState, useEffect } from "react";
import ShowForm from "./ShowForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState(undefined);
  const [isEditingShow, setIsEditingShow] = useState(false);
  const [isAddingShow, setIsAddingShow] = useState(false);
  
  useEffect(() => {
    if (!token) return;
    const getShows = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/show`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setShows(data);
      } catch (e) {
        setError(error);
      }
    }
    getShows();
  }, []);

  const editShow = (id) => {
    setIsEditingShow(isEditingShow === id ? null : id);
  }

  const addShow = (id) => {
    setIsAddingShow(!isAddingShow);
  }

  const deleteShow = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/show/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setShows(prev => prev.filter(show => show._id !== id));
      }
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <div>
      {error && <p>An error occurred: {error}</p>}
      <form>
        <label htmlFor="search">Search Shows</label>
        <input type="search" id="search" name="q"/>
        <button>Search</button>
      </form>
      {!isAddingShow && <button onClick={() => addShow()}>Add Show</button>}
      {isAddingShow && 
        <ShowForm 
          type="addShow" 
          onSuccess={(newShow) => {
            setShows(prev => [...prev, newShow]);
            setIsAddingShow(false);
          }}
        />}
      <ul>
        {shows.map((show) => {
          console.log(show)
          const name = show.name,
                id = show._id,
                artist = show.showDetails?.artist,
                date = show.showDetails?.date ? new Date(show.showDetails.date) : null,
                dateFormatted = date ? new Intl.DateTimeFormat('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric'
                }).format(date) : null,
                dateRaw = show.showDetails?.dateRaw,
                displayDate = dateFormatted || dateRaw,
                venue = show.showDetails?.venue,
                notes = show.notes,
                rating = show.rating,
                status = show.status;
          return (
            <li key={id}>
              <h2>{artist}</h2>
              <p>{name}</p>
              {venue && <p>{venue}</p>}
              {displayDate && <p>{displayDate}</p>}
              <p>{status}</p>
              {rating && <p>rating: {rating}</p>}
              {notes && <p>notes: {notes}</p>}
              <button onClick={() => editShow(id)}>Edit Show</button>
              {isEditingShow === id && 
                <ShowForm 
                  type="updateShow" 
                  id={id}
                  showData={{ name, artist, venue, notes, rating, status, dateRaw }}
                  onSuccess={(updated) => {
                    setShows(prev => prev.map(show => show._id === id ? updated : show));
                    setIsEditingShow(false);
                  }}
                />
              }
              <button onClick={() => deleteShow(id)}>Delete Show</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}