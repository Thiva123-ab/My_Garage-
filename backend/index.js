const express = require('express');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Dummy data for garage services
const services = [
  { id: 1, name: 'Oil Change', description: 'Full synthetic oil change and filter replacement.', price: 50 },
  { id: 2, name: 'Brake Inspection', description: 'Comprehensive inspection of brake pads and rotors.', price: 30 },
  { id: 3, name: 'Tire Rotation', description: 'Rotate tires to ensure even wear.', price: 20 },
  { id: 4, name: 'Engine Diagnostics', description: 'Check engine light code reading and diagnostics.', price: 80 },
  { id: 5, name: 'Car Wash & Detail', description: 'Premium exterior wash and interior detailing.', price: 100 }
];

app.get('/api/services', (req, res) => {
  res.json(services);
});

app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
