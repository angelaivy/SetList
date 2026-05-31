import { useState } from "react";
import { data } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ArtistForm({ type, id, artistData = {}, onSuccess }) {
  const [error, setError] = useState(undefined);
  const [isChecked, setIsChecked] = useState(artistData.favorite || false);
  let submitText,
      action,
      method,
      isRequired;
  
  if (type === "updateArtist") {
    submitText = "Update Artist";
    action = `${API_BASE_URL}/artist/${id}`;
    method = "PUT";
    isRequired = false;
  }
  if (type === "addArtist") {
    submitText = "Add Artist";
    action = `${API_BASE_URL}/artist`;
    method = "POST";
    isRequired = true;
  }

  const handleChange = async (e) => {
    setIsChecked(e.target.checked);
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataToJson = JSON.parse(JSON.stringify(Object.fromEntries(formData)));
    // artistData preserves preexisting fields when updating an artist.
    const dataFormatted = {
      name: formDataToJson.artistName || artistData.name,
      notes: formDataToJson.notes || artistData.notes,
      genre: formDataToJson.genre || artistData.genre,
      favorite: isChecked
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch(action, {
        method,
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify((dataFormatted))
      })

      if (res.ok) {
        const updated = await res.json();
        onSuccess(updated);
      }

      if (!res.ok) {
        const msg = await res.text();
        setError(msg);
        return;
      }
    }
    catch (e) {
      setError(e.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {error && <p>{error}</p>}
      <label htmlFor="artistName">Artist Name</label>
      <input type="text" id="artistName" name="artistName" required={isRequired} />

      <label htmlFor="genre">Genre</label>
      <input type="text" id="genre" name="genre"/>

      <label htmlFor="favorite">Favorite</label>
      <input type="checkbox" id="favorite" name="favorite" onChange={handleChange} checked={isChecked} />

      <label htmlFor="notes">Notes</label>
      <textarea id="notes" name="notes" rows="5"/>

      <button type="submit">{submitText}</button>
    </form>
  )
}