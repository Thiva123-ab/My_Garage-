require('dotenv').config();
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

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = process.env.PORT || 3001;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

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

app.post('/api/services', async (req, res) => {
  try {
    const { name, category, description, price, duration, icon } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: 'Name and price are required.' });
    }
    const serviceData = {
      id: Date.now(), // Generate a numeric ID for sorting
      name,
      category: category || 'General',
      description: description || '',
      price: Number(price),
      duration: duration || 'TBD',
      icon: icon || '🔧'
    };
    const docRef = await addDoc(collection(db, 'services'), serviceData);
    res.status(201).json({ message: 'Service created!', service: { _docId: docRef.id, ...serviceData } });
  } catch (error) {
    console.error('Error creating service:', error.message);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

app.patch('/api/services/:id', async (req, res) => {
  try {
    const serviceId = req.params.id; // This is the _docId
    const updates = req.body;
    
    const docRef = doc(db, 'services', serviceId);
    await updateDoc(docRef, updates);
    res.json({ message: 'Service updated!', updates });
  } catch (error) {
    console.error('Error updating service:', error.message);
    res.status(500).json({ error: 'Failed to update service' });
  }
});

app.delete('/api/services/:id', async (req, res) => {
  try {
    const { deleteDoc } = require('firebase/firestore');
    const docRef = doc(db, 'services', req.params.id);
    await deleteDoc(docRef);
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error.message);
    res.status(500).json({ error: 'Failed to delete service' });
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
    const job = jobs.find(j => j.id === jobId || j._docId === jobId);

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

// Delete job (for Admin dashboard)
app.delete('/api/jobs/:id', async (req, res) => {
  try {
    const jobId = req.params.id;
    const { deleteDoc } = require('firebase/firestore');
    
    // Find the job document by its 'id' field
    const jobs = await getCollection('jobs');
    const job = jobs.find(j => j.id === jobId || j._docId === jobId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const docRef = doc(db, 'jobs', job._docId);
    await deleteDoc(docRef);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error.message);
    res.status(500).json({ error: 'Failed to delete job' });
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

app.post('/api/testimonials', async (req, res) => {
  try {
    const { name, vehicle, rating, text } = req.body;
    if (!name || !vehicle || !rating || !text) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newTestimonial = {
      name,
      vehicle,
      rating: Number(rating),
      text,
      id: Date.now() // Simple unique ID generator
    };

    const docRef = await addDoc(collection(db, 'testimonials'), newTestimonial);
    res.status(201).json({ id: docRef.id, ...newTestimonial });
  } catch (error) {
    console.error('Error adding testimonial:', error.message);
    res.status(500).json({ error: 'Failed to add testimonial' });
  }
});

// ============================================================
// INVENTORY ROUTES
// ============================================================

app.get('/api/inventory', async (req, res) => {
  try {
    const inventory = await getCollection('inventory');
    res.json(inventory);
  } catch (error) {
    console.error('Error fetching inventory:', error.message);
    res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

app.post('/api/inventory', async (req, res) => {
  try {
    const { name, category, quantity, price, status, minStock, sku } = req.body;
    if (!name || quantity === undefined || price === undefined) {
      return res.status(400).json({ error: 'Name, quantity, and price are required.' });
    }
    const item = {
      name,
      category: category || 'General',
      quantity: Number(quantity),
      price: Number(price),
      status: status || (Number(quantity) > 0 ? 'In Stock' : 'Out of Stock'),
      minStock: minStock ? Number(minStock) : 5,
      sku: sku || `SKU-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, 'inventory'), item);
    res.status(201).json({ message: 'Inventory item created!', item: { _docId: docRef.id, ...item } });
  } catch (error) {
    console.error('Error creating inventory item:', error.message);
    res.status(500).json({ error: 'Failed to create inventory item' });
  }
});

app.patch('/api/inventory/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const updates = req.body;
    
    // Check if document exists first
    const docRef = doc(db, 'inventory', itemId);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) {
      return res.status(404).json({ error: 'Inventory item not found' });
    }

    await updateDoc(docRef, updates);
    res.json({ message: 'Inventory item updated!', updates });
  } catch (error) {
    console.error('Error updating inventory item:', error.message);
    res.status(500).json({ error: 'Failed to update inventory item' });
  }
});

app.delete('/api/inventory/:id', async (req, res) => {
  try {
    const { deleteDoc } = require('firebase/firestore');
    const docRef = doc(db, 'inventory', req.params.id);
    await deleteDoc(docRef);
    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Error deleting inventory item:', error.message);
    res.status(500).json({ error: 'Failed to delete inventory item' });
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

// ============================================================
// AI CHATBOT ROUTE
// ============================================================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'MISSING_KEY');

// Simple health endpoint to aid debugging in dev/prod
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    port,
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY) && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here',
    model: GEMINI_MODEL,
  });
});

app.post('/api/chat', async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
      return res.status(500).json({ error: 'Gemini API key is not configured. Please add it to the .env file.' });
    }

    const { history, message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required.' });
    }

    const model = genAI.getGenerativeModel({ 
      model: GEMINI_MODEL,
      systemInstruction: "You are a friendly, professional AI customer service assistant for 'AutoSync', a premium vehicle repair and maintenance garage. Keep your answers concise, helpful, and professional. AutoSync offers services like: Engine Diagnostics, Oil Changes, Brake Replacement, Tire Alignment, Electrical Repair, AC Repair, and Pre-Purchase Inspections. Use emojis naturally. Do not make up fake prices, instead suggest the user check the website or contact the garage directly. Do not act as an AI model, but as an integral part of the AutoSync team."
    });

    const formattedHistory = (history || [])
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
      }));

    while (formattedHistory.length > 0 && formattedHistory[0].role === 'model') {
      formattedHistory.shift();
    }

    const chatSession = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 800,
        temperature: 0.7,
      },
    });

    const result = await chatSession.sendMessage(message);
    const responseText = result.response.text();

    res.json({ text: responseText });
  } catch (error) {
    console.error('Error with Gemini API:', error?.stack || error?.message || error);
    res.status(500).json({ error: `Gemini error: ${error?.message || 'Unknown error'}` });
  }
});

app.listen(port, () => {
  console.log(`MyGarage Backend running at http://localhost:${port}`);
  console.log(`Connected to Firestore (project: mygarage-thiva)`);
});
