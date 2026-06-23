const { db } = require('./firebaseConfig');
const { collection, doc, setDoc } = require('firebase/firestore');

// ============================================================
// ALL GARAGE DATA TO SEED INTO FIRESTORE
// ============================================================

const services = [
  // Engine & Mechanical
  { id: 1, category: 'Engine & Mechanical', name: 'Engine Diagnostics', description: 'Advanced OBD-II scanning, check engine light diagnosis, and computer-based fault detection.', price: 80, icon: '🔧', duration: '1 hr' },
  { id: 2, category: 'Engine & Mechanical', name: 'Engine Repair & Rebuild', description: 'Complete engine teardown, inspection, and rebuild with OEM-quality parts.', price: 1500, icon: '⚙️', duration: '3-5 days' },
  { id: 3, category: 'Engine & Mechanical', name: 'Timing Belt / Chain Replacement', description: 'Replace worn timing belts or chains to prevent catastrophic engine failure.', price: 450, icon: '🔗', duration: '3-5 hrs' },
  { id: 4, category: 'Engine & Mechanical', name: 'Head Gasket Repair', description: 'Fix blown head gaskets, resurface cylinder heads, and restore compression.', price: 1200, icon: '🛠️', duration: '2-3 days' },

  // Oil & Fluids
  { id: 5, category: 'Oil & Fluids', name: 'Full Synthetic Oil Change', description: 'Premium full-synthetic oil, new filter, and 21-point inspection included.', price: 65, icon: '🛢️', duration: '30 min' },
  { id: 6, category: 'Oil & Fluids', name: 'Transmission Fluid Flush', description: 'Complete flush and refill of automatic or manual transmission fluid.', price: 180, icon: '💧', duration: '1 hr' },
  { id: 7, category: 'Oil & Fluids', name: 'Coolant System Flush', description: 'Drain, flush, and refill coolant system to prevent overheating.', price: 120, icon: '❄️', duration: '45 min' },
  { id: 8, category: 'Oil & Fluids', name: 'Brake Fluid Replacement', description: 'Bleed and replace brake fluid for optimal braking performance.', price: 90, icon: '🧴', duration: '45 min' },

  // Brakes
  { id: 9, category: 'Brakes', name: 'Brake Pad Replacement', description: 'Install new ceramic or semi-metallic brake pads on front or rear axle.', price: 180, icon: '🛑', duration: '1-2 hrs' },
  { id: 10, category: 'Brakes', name: 'Brake Rotor Resurfacing / Replacement', description: 'Resurface or replace warped rotors for smooth, safe stopping.', price: 250, icon: '💿', duration: '2 hrs' },
  { id: 11, category: 'Brakes', name: 'Brake Caliper Repair', description: 'Rebuild or replace seized or leaking brake calipers.', price: 320, icon: '🔩', duration: '2-3 hrs' },

  // Tires & Wheels
  { id: 12, category: 'Tires & Wheels', name: 'Tire Replacement & Mounting', description: 'Supply and mount new tires, including balancing and valve stems.', price: 120, icon: '🔘', duration: '1 hr' },
  { id: 13, category: 'Tires & Wheels', name: 'Wheel Alignment', description: 'Precision 4-wheel alignment using laser-guided equipment.', price: 85, icon: '📐', duration: '45 min' },
  { id: 14, category: 'Tires & Wheels', name: 'Tire Rotation & Balancing', description: 'Rotate and rebalance all four tires for even tread wear.', price: 40, icon: '🔄', duration: '30 min' },
  { id: 15, category: 'Tires & Wheels', name: 'Flat Tire Repair', description: 'Patch or plug punctured tires and restore to safe pressure.', price: 25, icon: '🩹', duration: '20 min' },

  // Electrical
  { id: 16, category: 'Electrical', name: 'Battery Testing & Replacement', description: 'Load-test battery and install new one if needed with warranty.', price: 150, icon: '🔋', duration: '30 min' },
  { id: 17, category: 'Electrical', name: 'Alternator Repair / Replacement', description: 'Diagnose charging issues and replace faulty alternators.', price: 380, icon: '⚡', duration: '2 hrs' },
  { id: 18, category: 'Electrical', name: 'Starter Motor Replacement', description: 'Replace worn starter motor for reliable engine cranking.', price: 350, icon: '🔑', duration: '2 hrs' },
  { id: 19, category: 'Electrical', name: 'Wiring & Lighting Repair', description: 'Fix faulty wiring, headlights, tail lights, and interior lighting.', price: 100, icon: '💡', duration: '1-2 hrs' },

  // Suspension & Steering
  { id: 20, category: 'Suspension & Steering', name: 'Shock & Strut Replacement', description: 'Replace worn shocks or struts for a smoother, safer ride.', price: 400, icon: '🏎️', duration: '2-3 hrs' },
  { id: 21, category: 'Suspension & Steering', name: 'Power Steering Repair', description: 'Fix leaks, replace pump, or flush power steering system.', price: 300, icon: '🎯', duration: '2 hrs' },
  { id: 22, category: 'Suspension & Steering', name: 'Ball Joint / Tie Rod Replacement', description: 'Replace worn steering and suspension linkage components.', price: 250, icon: '🔗', duration: '2 hrs' },

  // Exhaust & Emissions
  { id: 23, category: 'Exhaust & Emissions', name: 'Exhaust System Repair', description: 'Weld, patch, or replace damaged muffler, pipes, and catalytic converter.', price: 350, icon: '💨', duration: '2-3 hrs' },
  { id: 24, category: 'Exhaust & Emissions', name: 'Emissions Testing & Repair', description: 'Perform emissions test and fix issues to pass inspection.', price: 100, icon: '🌿', duration: '1 hr' },

  // AC & Heating
  { id: 25, category: 'AC & Heating', name: 'AC Recharge & Repair', description: 'Evacuate, recharge refrigerant, and repair leaks in AC system.', price: 200, icon: '🧊', duration: '1-2 hrs' },
  { id: 26, category: 'AC & Heating', name: 'Heater Core Replacement', description: 'Replace clogged or leaking heater core for cabin heating.', price: 600, icon: '🔥', duration: '4-6 hrs' },

  // Body & Paint
  { id: 27, category: 'Body & Paint', name: 'Dent Removal (PDR)', description: 'Paintless dent repair for minor dents and dings without repainting.', price: 150, icon: '🪄', duration: '1-2 hrs' },
  { id: 28, category: 'Body & Paint', name: 'Scratch & Paint Repair', description: 'Color-matched paint touch-up, scratch buffing, and panel repaint.', price: 300, icon: '🎨', duration: '1-2 days' },
  { id: 29, category: 'Body & Paint', name: 'Full Body Respray', description: 'Complete vehicle repaint with primer, base coat, and clear coat.', price: 3000, icon: '🖌️', duration: '5-7 days' },

  // Transmission
  { id: 30, category: 'Transmission', name: 'Clutch Replacement', description: 'Replace worn clutch disc, pressure plate, and throw-out bearing.', price: 800, icon: '🔀', duration: '4-6 hrs' },
  { id: 31, category: 'Transmission', name: 'Gearbox Repair', description: 'Diagnose and repair manual or automatic gearbox issues.', price: 1200, icon: '⚙️', duration: '2-4 days' },

  // Inspection & Maintenance
  { id: 32, category: 'Inspection & Maintenance', name: 'Full Vehicle Inspection', description: 'Comprehensive 50-point safety and mechanical inspection report.', price: 60, icon: '📋', duration: '1 hr' },
  { id: 33, category: 'Inspection & Maintenance', name: 'Pre-Purchase Inspection', description: 'Thorough inspection before buying a used vehicle — engine, body, frame.', price: 100, icon: '🔍', duration: '1.5 hrs' },
  { id: 34, category: 'Inspection & Maintenance', name: 'Scheduled Maintenance Service', description: 'Manufacturer-recommended service at mileage intervals (30k, 60k, 90k).', price: 250, icon: '📅', duration: '2-4 hrs' },
];

const jobBoard = [];

const teamMembers = [
  { id: 1, name: 'James Rodriguez', role: 'Master Mechanic', specialty: 'Engine & Transmission', experience: '15 years', avatar: '👨‍🔧' },
  { id: 2, name: 'Michael Chen', role: 'Senior Technician', specialty: 'Electrical & Diagnostics', experience: '10 years', avatar: '🧑‍🔧' },
  { id: 3, name: 'Sarah Thompson', role: 'Body & Paint Specialist', specialty: 'Collision Repair & Painting', experience: '8 years', avatar: '👩‍🔧' },
  { id: 4, name: 'David Park', role: 'Tire & Alignment Tech', specialty: 'Suspension & Steering', experience: '6 years', avatar: '🧑‍🔧' },
];

const testimonials = [
  { id: 1, name: 'Robert H.', rating: 5, text: 'Outstanding service! They diagnosed an engine issue other shops missed. Fair pricing too.', vehicle: '2020 Audi A4' },
  { id: 2, name: 'Maria G.', rating: 5, text: 'Best AC repair I have ever had. My car feels brand new in this heat!', vehicle: '2019 Honda CR-V' },
  { id: 3, name: 'Kevin T.', rating: 4, text: 'Quick oil change and they caught a brake issue before it became dangerous. Highly recommend.', vehicle: '2021 Chevrolet Malibu' },
  { id: 4, name: 'Jennifer L.', rating: 5, text: 'The body work was flawless. You cannot even tell where the dent used to be!', vehicle: '2022 Tesla Model 3' },
];

// ============================================================
// SEED FUNCTION
// ============================================================

async function seedCollection(collectionName, items, idField) {
  console.log(`\n📦 Seeding "${collectionName}" (${items.length} documents)...`);
  for (const item of items) {
    const docId = String(item[idField]);
    const docRef = doc(collection(db, collectionName), docId);
    await setDoc(docRef, item);
    console.log(`  ✅ ${collectionName}/${docId}`);
  }
  console.log(`✔  "${collectionName}" seeded successfully!`);
}

async function seed() {
  console.log('🚀 Starting MyGarage Firestore data seeding...\n');

  try {
    await seedCollection('services', services, 'id');
    await seedCollection('jobs', jobBoard, 'id');
    await seedCollection('team', teamMembers, 'id');
    await seedCollection('testimonials', testimonials, 'id');

    console.log('\n🎉 All data seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   - Services:     ${services.length} documents`);
    console.log(`   - Jobs:         ${jobBoard.length} documents`);
    console.log(`   - Team:         ${teamMembers.length} documents`);
    console.log(`   - Testimonials: ${testimonials.length} documents`);
    console.log('\nYou can now start the backend with: node index.js');
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  }

  process.exit(0);
}

seed();
