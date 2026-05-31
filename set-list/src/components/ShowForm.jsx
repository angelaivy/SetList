import { useState } from "react";
import { data } from "react-router";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const token = localStorage.getItem('token');

export default function ShowForm({ type, id, showData = {}, onSuccess }) {
  const [error, setError] = useState(undefined);
  let submitText,
      action,
      method,
      isRequired;

  if (type === "updateShow") {
    submitText = "Update show";
    action = `${API_BASE_URL}/show/${id}`;
    method = "PUT";
    isRequired = false;
  }
  if (type === "addShow") {
    submitText = "Add show";
    action = `${API_BASE_URL}/show`;
    method = "POST";
    isRequired = true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const formDataToJson = JSON.parse(JSON.stringify(Object.fromEntries(formData)));
    const dataFormatted = {
      name: formDataToJson.showName || showData.name,
      showDetails: {
        artist: formDataToJson.artist || showData.artist,
        venue: formDataToJson.venue || showData.venue,
        dateRaw: formDataToJson.date || showData.date,
      },
      notes: formDataToJson.notes || showData.notes,
      rating: formDataToJson.rating || showData.rating,
      status: formDataToJson.status || showData.status
    }

    try {
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
      <label htmlFor="showName">Show Name</label>
      <input type="text" id="showName" name="showName" required={isRequired} />

      <label htmlFor="artist">Artist</label>
      {<input type="text" id="artist" name="artist" required={isRequired} />}

      <label htmlFor="venue">Venue</label>
      <input type="text" id="venue" name="venue"/>

      <label htmlFor="date">Date</label>
      <input type="text" id="date" name="date"/>

      <label htmlFor="rating">Rating (1-5)</label>
      <input type="number" min="1" max="5" id="rating" name="rating"/>

      <label htmlFor="status">Status</label>
      <select id="status" name="status" required={isRequired}>
        <option value="">--Select Status--</option>
        <option value="Wishlist">Wishlist</option>
        <option value="Attended">Attended</option>
      </select>

      <label htmlFor="notes"></label>
      <input id="notes" name="notes" rows="5"/>

      <button type="submit">{submitText}</button>
    </form>
  )
}