import { useState, useEffect } from "react";
import ArtistForm from "./ArtistForm";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Artists() {
  const [artists, setArtists] = useState([]);
  const [error, setError] = useState(undefined);
  const [isEditingArtist, setIsEditingArtist] = useState(false);
  const [isAddingArtist, setIsAddingArtist] = useState(false);
  
  const getArtists = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/artist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setArtists(data);
    } catch (e) {
      setError(error);
    }
  }
  useEffect(() => {
    getArtists();
  }, []);

  const editArtist = (id) => {
    setIsEditingArtist(isEditingArtist === id ? null : id);
  }

  const addArtist = (id) => {
    setIsAddingArtist(!isAddingArtist);
  }

  const deleteArtist = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/artist/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setArtists(prev => prev.filter(artist => artist._id !== id));
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
          const res = await fetch(`${API_BASE_URL}/artist/search?query=${query}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setArtists(data);
        }
      }
      if (!query) {
        getArtists()
      }
    } catch (e) {
      setError(error);
    }
  }

  return (
    <div>
      {error && <p>An error occurred: {error}</p>}
      <form onSubmit={handleSearch}>
        <label htmlFor="search">Search Artists</label>
        <input type="search" id="search" name="q"/>
        <button>Search</button>
      </form>
      {!isAddingArtist && <button onClick={() => addArtist()}>Add Artist</button>}
      {isAddingArtist && 
        <ArtistForm 
          type="addArtist" 
          onSuccess={(newArtist) => {
            setArtists(prev => [...prev, newArtist]);
            setIsAddingArtist(false);
          }}
        />}
      <ul>
        {artists.map((artist) => {
          const name = artist.name,
                id = artist._id,
                genre = artist.genre,
                notes = artist.notes,
                favorite = artist.favorite;
          return (
            <li key={id}>
              <h2>{name}{favorite && <span>★</span>}</h2>
              {genre && <p>{genre}</p>}
              {notes && <p>notes: {notes}</p>}
              <button onClick={() => editArtist(id)}>Edit Artist</button>
              {isEditingArtist === id && 
                <ArtistForm 
                  type="updateArtist" 
                  id={id}
                  artistData={{ name, genre, notes, favorite}}
                  onSuccess={(updated) => {
                    setArtists(prev => prev.map(artist => artist._id === id ? updated : artist));
                    setIsEditingArtist(false);
                  }}
                />
              }
              <button onClick={() => deleteArtist(id)}>Delete Artist</button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}