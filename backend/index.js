const express = require('express');
const cors = require('cors');
const { db } = require('./firebaseConfig');
const {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  query,
  orderBy,
} = require('firebase/firestore');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// ============================================================
// HELPER — read all documents from a Firestore collection
// ============================================================
async function getCollection(name) {
  const snapshot = await getDocs(collection(db, name));
  return snapshot.docs.map(doc => ({ _docId: doc.id, ...doc.data() }));
}

// ============================================================
// API ROUTES
// ============================================================

// Services
app.get('/api/services', async (req, res) => {
  try {
    const services = await getCollection('services');
    // Sort by id for consistent ordering
    services.sort((a, b) => a.id - b.id);
    res.json(services);
  } catch (error) {
    console.error('Error fetching services:', error.message);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

app.get('/api/services/categories', async (req, res) => {
  try {
    const services = await getCollection('services');
    // Sort by id to keep category order consistent
    services.sort((a, b) => a.id - b.id);
    const categories = [...new Set(services.map(s => s.category))];
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error.message);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Job Board
app.get('/api/jobs', async (req, res) => {
  try {
    const jobs = await getCollection('jobs');
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error.message);
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

// Create a new job (for Service Advisor dashboard)
app.post('/api/jobs', async (req, res) => {
  try {
    const { id, vehicle, owner, service, status, eta } = req.body;
    if (!vehicle || !owner || !service) {
      return res.status(400).json({ error: 'Vehicle, owner, and service are required.' });
    }
    const jobData = {
      id: id || 'J' + Date.now(),
      vehicle,
      owner,
      service,
      status: status || 'Pending',
      eta: eta || 'TBD',
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'jobs'), jobData);
    res.status(201).json({ message: 'Job created!', job: { _docId: docRef.id, ...jobData } });
  } catch (error) {
    console.error('Error creating job:', error.message);
    res.status(500).json({ error: 'Failed to create job' });
  }
});

// Update job status (for Mechanic dashboard)
app.patch('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { status, eta } = req.body;

    // Find the job document by its 'id' field
    const jobs = await getCollection('jobs');
    const job = jobs.find(j => j.id === jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (eta) updates.eta = eta;

    const docRef = doc(db, 'jobs', job._docId);
    await updateDoc(docRef, updates);

    res.json({ message: 'Job updated!', job: { ...job, ...updates } });
  } catch (error) {
    console.error('Error updating job:', error.message);
    res.status(500).json({ error: 'Failed to update job' });
  }
});

// Team
app.get('/api/team', async (req, res) => {
  try {
    const team = await getCollection('team');
    team.sort((a, b) => a.id - b.id);
    res.json(team);
  } catch (error) {
    console.error('Error fetching team:', error.message);
    res.status(500).json({ error: 'Failed to fetch team' });
  }
});

// Testimonials
app.get('/api/testimonials', async (req, res) => {
  try {
    const testimonials = await getCollection('testimonials');
    testimonials.sort((a, b) => a.id - b.id);
    res.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error.message);
    res.status(500).json({ error: 'Failed to fetch testimonials' });
  }
});

// Booking endpoint — NOW PERSISTS TO FIRESTORE
app.post('/api/book', async (req, res) => {
  try {
    const { name, phone, vehicle, service, date, notes } = req.body;
    if (!name || !phone || !vehicle || !service) {
      return res.status(400).json({ error: 'Name, phone, vehicle, and service are required.' });
    }
    const booking = {
      id: 'B' + Date.now(),
      name,
      phone,
      vehicle,
      service,
      date: date || '',
      notes: notes || '',
      status: 'Confirmed',
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, 'bookings'), booking);
    res.status(201).json({ message: 'Booking confirmed!', booking });
  } catch (error) {
    console.error('Error creating booking:', error.message);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

// Contact endpoint — NOW PERSISTS TO FIRESTORE
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    const contact = {
      id: 'C' + Date.now(),
      name,
      email,
      message,
      createdAt: new Date().toISOString(),
    };
    await addDoc(collection(db, 'contacts'), contact);
    res.json({ message: 'Message received! We will get back to you shortly.' });
  } catch (error) {
    console.error('Error saving contact:', error.message);
    res.status(500).json({ error: 'Failed to save contact message' });
  }
});

app.listen(port, () => {
  console.log(`MyGarage Backend running at http://localhost:${port}`);
  console.log(`Connected to Firestore (project: mygarage-thiva)`);
});
