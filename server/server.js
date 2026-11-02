import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json());

const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 100 },
  date: { type: String, required: true },
  venue: { type: String, required: true, trim: true, maxlength: 100 },
  seats: { type: Number, required: true, min: 1, default: 50 }
}, { timestamps: true });
const Event = mongoose.model('Event', eventSchema);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'TechFest API' }));
app.get('/api/events', async (_req, res) => {
  try { res.json(await Event.find().sort({ createdAt: -1 })); }
  catch { res.status(500).json({ message: 'Could not retrieve events.' }); }
});
app.post('/api/events', async (req, res) => {
  try {
    const { title, date, venue, seats } = req.body;
    if (!title?.trim() || !date || !venue?.trim()) return res.status(400).json({ message: 'Title, date and venue are required.' });
    const event = await Event.create({ title, date, venue, seats: Number(seats) || 50 });
    res.status(201).json(event);
  } catch (err) { res.status(400).json({ message: err.message || 'Could not create event.' }); }
});
app.delete('/api/events/:id', async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid event ID.' });
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found.' });
    res.json({ message: 'Event deleted successfully.' });
  } catch { res.status(500).json({ message: 'Could not delete event.' }); }
});

async function start() {
  if (!process.env.MONGO_URI) { console.error('MONGO_URI is missing. Copy .env.example to .env and configure it.'); process.exit(1); }
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`));
  } catch (err) { console.error('MongoDB connection failed:', err.message); process.exit(1); }
}
start();
