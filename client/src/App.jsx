import { useEffect, useState } from 'react';
const API = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

export default function App() {
  const [events, setEvents] = useState([]);
  const [form, setForm] = useState({ title: '', date: '', venue: '', seats: '50' });
  const [message, setMessage] = useState('Loading events...');
  const [busy, setBusy] = useState(false);

  async function loadEvents() {
    try {
      const response = await fetch(`${API}/api/events`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not load events');
      setEvents(data);
      setMessage(data.length ? '' : 'No events yet. Add your first event below.');
    } catch {
      setMessage('Cannot connect to API. Check the backend and MongoDB settings.');
    }
  }
  useEffect(() => { loadEvents(); }, []);
  function update(e) { setForm({ ...form, [e.target.name]: e.target.value }); }

  async function submit(e) {
    e.preventDefault(); setBusy(true); setMessage('');
    try {
      const response = await fetch(`${API}/api/events`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not add event');
      setForm({ title: '', date: '', venue: '', seats: '50' });
      setMessage('Event added successfully.'); await loadEvents();
    } catch (err) { setMessage(err.message || 'Request failed.'); }
    finally { setBusy(false); }
  }
  async function remove(id) {
    if (!window.confirm('Delete this event?')) return;
    try {
      const response = await fetch(`${API}/api/events/${id}`, { method: 'DELETE' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Could not delete event');
      setMessage('Event deleted successfully.'); await loadEvents();
    } catch (err) { setMessage(err.message || 'Request failed.'); }
  }

  return <main className="page">
    <nav className="navbar"><div className="brand">🏆 Tech Fest 2026</div><div className="navlinks"><a href="#home">Home</a><a href="#events">Events</a><a href="#add">Register</a></div></nav>
    <section className="hero" id="home"><div><p className="eyebrow">COLLEGE EVENT MANAGEMENT</p><h1>Welcome to<br/><span>Tech Fest 2026!</span></h1><p>Innovate · Participate · Explore</p><a className="cta" href="#events">View Events →</a></div><div className="art" aria-hidden="true">💻<span>⚙️</span><b>💡</b><small>&lt; / &gt;</small></div></section>
    <section className="panel" id="events"><div className="section-heading"><h2>Upcoming Events</h2><span>{events.length} events</span></div>
      {events.length === 0 ? <p className="empty">{message || 'No events added yet.'}</p> : <div className="event-grid">{events.map(event => <article className="event-card" key={event._id}><span className="tag">AVAILABLE</span><h3>{event.title}</h3><p>📅 {event.date}</p><p>📍 {event.venue}</p><p>Seats: <strong>{event.seats}</strong></p><button className="delete" onClick={() => remove(event._id)}>Delete</button></article>)}</div>}
    </section>
    <section className="panel" id="add"><h2>Register a new event</h2><form onSubmit={submit} className="event-form"><label>Event title<input name="title" value={form.title} onChange={update} placeholder="AI Workshop" maxLength="100" required/></label><label>Date<input type="date" name="date" value={form.date} onChange={update} required/></label><label>Venue<input name="venue" value={form.venue} onChange={update} placeholder="Main Auditorium" maxLength="100" required/></label><label>Available seats<input type="number" name="seats" value={form.seats} onChange={update} min="1" max="10000" required/></label><div className="actions"><button type="submit" disabled={busy}>{busy ? 'Saving...' : 'Add event'}</button><button type="reset" className="secondary" onClick={() => setForm({ title: '', date: '', venue: '', seats: '50' })}>Reset</button></div></form>{message && <p className="message" role="status">{message}</p>}</section>
    <footer>© 2026 Tech Fest. All rights reserved. <span>Built with React · Express · Node.js · MongoDB</span></footer>
  </main>;
}
