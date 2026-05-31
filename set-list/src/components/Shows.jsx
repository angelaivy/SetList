import { useState, useEffect } from "react";
import ShowForm from "./ShowForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Shows() {
  const [shows, setShows] = useState([]);
  const [error, setError] = useState(undefined);
  const [isEditingShow, setIsEditingShow] = useState(false);
  const [isAddingShow, setIsAddingShow] = useState(false);
  
  const getShows = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
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
  useEffect(() => {
    getShows();
  }, []);

  const editShow = (id) => {
    setIsEditingShow(isEditingShow === id ? null : id);
  }

  const addShow = (id) => {
    setIsAddingShow(!isAddingShow);
  }

  const deleteShow = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
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

  const handleSearch = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) return;
    const formData = new FormData(e.currentTarget);
    const query = formData.get('q');

    try {
      if (query) {
          const res = await fetch(`${API_BASE_URL}/show/search?query=${query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setShows(data);
        }
      }
      if (!query) {
        getShows()
      }
    } catch (e) {
      setError(error);
    }
  }

  return (
    <div>
      {error && <p>An error occurred: {error}</p>}
      <form onSubmit={handleSearch}>
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