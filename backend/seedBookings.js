const { db } = require('./firebaseConfig');
const { collection, addDoc } = require('firebase/firestore');

const bookings = [
  {
    name: 'Samantha Perera',
    phone: '+94 77 123 4567',
    vehicle: '2019 Toyota Premio',
    service: 'Premium Full-Synthetic Oil Service',
    date: '2026-06-25',
    notes: 'Please check the wiper blades as well, they might need replacing.',
  },
  {
    name: 'Nimal Fernando',
    phone: '+94 71 987 6543',
    vehicle: '2021 BMW X3',
    service: 'Comprehensive Pre-Purchase Inspection',
    date: '2026-06-26',
    notes: 'Buying this used, need a thorough check of the transmission.',
  },
  {
    name: 'Amanda Silva',
    phone: '+94 75 555 1234',
    vehicle: '2015 Honda Fit Hybrid',
    service: 'Computerized 4-Wheel Alignment',
    date: '2026-06-24',
    notes: 'Steering is pulling to the left slightly.',
  }
];

async function seedBookings() {
  console.log('🚀 Seeding realistic appointments (bookings) to Firestore...');
  try {
    for (const b of bookings) {
      const bookingRecord = {
        id: 'B' + Date.now() + Math.floor(Math.random() * 1000),
        name: b.name,
        phone: b.phone,
        vehicle: b.vehicle,
        service: b.service,
        date: b.date,
        notes: b.notes,
        status: 'Confirmed',
        createdAt: new Date().toISOString(),
      };
      
      const docRef = await addDoc(collection(db, 'bookings'), bookingRecord);
      console.log(`  ✅ Added booking for ${b.name} (Doc ID: ${docRef.id})`);
    }
    console.log('\n🎉 Appointments seeded successfully! Check the "bookings" collection in Firebase.');
  } catch (error) {
    console.error('❌ Error seeding bookings:', error.message);
  }
  process.exit(0);
}

seedBookings();
