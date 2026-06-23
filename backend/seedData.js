const { db } = require('./firebaseConfig');
const { collection, doc, setDoc } = require('firebase/firestore');

// ============================================================
// REALISTIC GARAGE DATA TO SEED INTO FIRESTORE
// ============================================================

const services = [
  // Engine & Mechanical
  { id: 1, category: 'Engine & Mechanical', name: 'Comprehensive Engine Diagnostics', description: 'Advanced OBD-II and oscilloscope scanning, real-time sensor data logging, and professional fault detection.', price: 120, icon: '🔧', duration: '1-2 hrs' },
  { id: 2, category: 'Engine & Mechanical', name: 'Engine Rebuild & Overhaul', description: 'Complete teardown, precision machining, gasket replacement, and reassembly with OEM-certified parts.', price: 2500, icon: '⚙️', duration: '5-7 days' },
  { id: 3, category: 'Engine & Mechanical', name: 'Timing Belt & Water Pump Service', description: 'Replacement of timing belt, tensioners, idler pulleys, and water pump to prevent catastrophic failure.', price: 650, icon: '🔗', duration: '4-6 hrs' },
  { id: 4, category: 'Engine & Mechanical', name: 'Cylinder Head Gasket Repair', description: 'Cylinder head resurfacing, valve seating, pressure testing, and multi-layer steel gasket installation.', price: 1400, icon: '🛠️', duration: '3 days' },

  // Oil & Fluids
  { id: 5, category: 'Oil & Fluids', name: 'Premium Full-Synthetic Oil Service', description: 'Includes up to 5 quarts of Mobil 1 synthetic oil, premium OEM filter, and a comprehensive 30-point safety inspection.', price: 85, icon: '🛢️', duration: '45 min' },
  { id: 6, category: 'Oil & Fluids', name: 'Transmission Fluid Exchange', description: 'Complete hydraulic flush and refill of automatic or manual transmission fluid using OEM-grade spec fluid.', price: 210, icon: '💧', duration: '1.5 hrs' },
  { id: 7, category: 'Oil & Fluids', name: 'Coolant System Power Flush', description: 'Pressurized drain, chemical flush, and refill of engine coolant to prevent overheating and corrosion.', price: 145, icon: '❄️', duration: '1 hr' },
  { id: 8, category: 'Oil & Fluids', name: 'Brake Fluid Bleed & Replacement', description: 'Vacuum bleed of all brake lines and ABS pump module, replacing old fluid with high-temp DOT 4 fluid.', price: 110, icon: '🧴', duration: '1 hr' },

  // Brakes
  { id: 9, category: 'Brakes', name: 'Premium Ceramic Brake Pad Replacement', description: 'Installation of ultra-quiet, low-dust ceramic brake pads on front or rear axles. Includes caliper greasing.', price: 220, icon: '🛑', duration: '1.5 hrs' },
  { id: 10, category: 'Brakes', name: 'Brake Rotor Replacement', description: 'Replacement of scored or warped brake rotors with high-carbon, cross-drilled, or slotted OEM equivalents.', price: 350, icon: '💿', duration: '2 hrs' },
  { id: 11, category: 'Brakes', name: 'Brake Caliper Rebuild', description: 'Complete disassembly, cleaning, and resealing of seized or leaking brake calipers with new pistons/seals.', price: 280, icon: '🔩', duration: '3 hrs' },

  // Tires & Wheels
  { id: 12, category: 'Tires & Wheels', name: 'Tire Mounting & Road-Force Balancing', description: 'Mounting of new tires and precision Road-Force balancing to eliminate high-speed steering wheel vibrations.', price: 160, icon: '🔘', duration: '1.5 hrs' },
  { id: 13, category: 'Tires & Wheels', name: 'Computerized 4-Wheel Alignment', description: 'Precision laser-guided 4-wheel alignment to factory camber, caster, and toe specifications.', price: 115, icon: '📐', duration: '1 hr' },
  { id: 14, category: 'Tires & Wheels', name: 'Tire Rotation & Tread Inspection', description: 'Cross-rotation of tires to ensure even tread wear, including a deep inspection of sidewall health.', price: 45, icon: '🔄', duration: '30 min' },

  // Electrical
  { id: 15, category: 'Electrical', name: 'Battery Load Testing & Replacement', description: 'Deep-cycle load testing. Includes installation of a new AGM battery with terminal anti-corrosion treatment.', price: 185, icon: '🔋', duration: '45 min' },
  { id: 16, category: 'Electrical', name: 'Alternator & Charging System Repair', description: 'Full charging system diagnostic. Replacement of faulty alternators with heavy-duty OEM components.', price: 450, icon: '⚡', duration: '2.5 hrs' },
  { id: 17, category: 'Electrical', name: 'Complex Wiring & Harness Repair', description: 'Tracing and repairing electrical shorts, parasitic battery drains, and rodent-damaged wire harnesses.', price: 150, icon: '💡', duration: 'Diagnostic-based' },

  // Suspension & Steering
  { id: 18, category: 'Suspension & Steering', name: 'MacPherson Strut & Shock Replacement', description: 'Replacement of leaking or worn shock absorbers/struts to restore factory ride comfort and handling.', price: 550, icon: '🏎️', duration: '3 hrs' },
  { id: 19, category: 'Suspension & Steering', name: 'Power Steering Rack Replacement', description: 'Replacement of leaking steering racks, including high-pressure lines and a full hydraulic system flush.', price: 850, icon: '🎯', duration: '4 hrs' },

  // AC & Heating
  { id: 20, category: 'AC & Heating', name: 'AC Evacuation & Recharge', description: 'Vacuum evacuation of the AC system, leak testing with UV dye, and precision recharge of R134a/R1234yf refrigerant.', price: 225, icon: '🧊', duration: '1.5 hrs' },
  { id: 21, category: 'AC & Heating', name: 'HVAC Blend Door Actuator Repair', description: 'Dashboard disassembly to replace failing blend door actuators causing uneven cabin temperature.', price: 400, icon: '🔥', duration: '3-5 hrs' },

  // Body & Paint
  { id: 22, category: 'Body & Paint', name: 'Paintless Dent Repair (PDR)', description: 'Specialized removal of hail damage, door dings, and minor creases without the need for repainting or body filler.', price: 180, icon: '🪄', duration: '1-3 hrs' },
  { id: 23, category: 'Body & Paint', name: 'Ceramic Coating & Paint Correction', description: 'Multi-stage machine compounding and polishing, followed by a professional 9H ceramic coating application.', price: 850, icon: '✨', duration: '2 days' },

  // Transmission
  { id: 24, category: 'Transmission', name: 'Dual-Clutch / Manual Clutch Replacement', description: 'Replacement of worn clutch friction discs, pressure plates, dual-mass flywheels, and throw-out bearings.', price: 1100, icon: '🔀', duration: '6-8 hrs' },

  // Inspection & Maintenance
  { id: 25, category: 'Inspection & Maintenance', name: 'Comprehensive Pre-Purchase Inspection', description: 'A rigorous 150-point inspection covering drivetrain, chassis, electronics, and paint depth to verify vehicle history.', price: 175, icon: '🔍', duration: '2 hrs' },
  { id: 26, category: 'Inspection & Maintenance', name: 'Factory 60k/90k Mile Service', description: 'Complete scheduled maintenance following strict manufacturer guidelines to keep your warranty intact.', price: 350, icon: '📅', duration: '3-4 hrs' },
];

const jobBoard = [
  { id: 'J001', vehicle: '2022 Lexus RX 350', owner: 'Robert Perera', service: 'Premium Full-Synthetic Oil Service', status: 'In Progress', eta: '45 min' },
  { id: 'J002', vehicle: '2019 Ford Mustang GT', owner: 'Daniel Smith', service: 'Brake Rotor Replacement', status: 'Pending', eta: '2 hrs' },
  { id: 'J003', vehicle: '2021 Honda CR-V', owner: 'Priya Sharma', service: 'Computerized 4-Wheel Alignment', status: 'Ready for Pickup', eta: 'Done' },
  { id: 'J004', vehicle: '2018 Toyota Hilux', owner: 'Kasun Bandara', service: 'Comprehensive Engine Diagnostics', status: 'In Progress', eta: '3 hrs' },
  { id: 'J005', vehicle: '2023 Tesla Model Y', owner: 'Jennifer Wong', service: 'Comprehensive Pre-Purchase Inspection', status: 'Completed', eta: 'Done' },
];

const teamMembers = [
  { id: 1, name: 'Michael Thompson', role: 'Master Diagnostic Tech', specialty: 'Advanced Electronics & Diagnostics', experience: '15 years', avatar: '👨‍🔧' },
  { id: 2, name: 'David Silva', role: 'Lead Technician', specialty: 'Engine Performance & Drivetrain', experience: '12 years', avatar: '🧑‍🔧' },
  { id: 3, name: 'Sarah Jenkins', role: 'Transmission Specialist', specialty: 'Automatic & Manual Gearboxes', experience: '8 years', avatar: '👩‍🔧' },
  { id: 4, name: 'James Miller', role: 'Chassis & Alignment Tech', specialty: 'Suspension, Brakes & Steering', experience: '10 years', avatar: '🧑‍🔧' },
];

const testimonials = [
  { id: 1, name: 'Marcus T.', rating: 5, text: 'The team at MyGarage is exceptional. They properly diagnosed an electrical module issue on my BMW that the dealership couldn\'t even figure out. Highly recommended!', vehicle: '2020 BMW 530i' },
  { id: 2, name: 'Amanda R.', rating: 5, text: 'Honest pricing and incredible turnaround time. David explained exactly what was wrong with my suspension and showed me the worn out parts before doing any work.', vehicle: '2018 Subaru Outback' },
  { id: 3, name: 'S. Fernando', rating: 4, text: 'Got a full synthetic oil change and tire rotation done here. The waiting area is spotless, and they finished 15 minutes faster than promised.', vehicle: '2022 Toyota Corolla' },
  { id: 4, name: 'John D.', rating: 5, text: 'I brought my truck in for transmission shuddering. Sarah rebuilt the valve body and it drives like it just rolled off the factory floor. Worth every penny.', vehicle: '2019 Ford F-150' },
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
  console.log('🚀 Starting MyGarage REALISTIC Firestore data seeding...\n');

  try {
    await seedCollection('services', services, 'id');
    await seedCollection('jobs', jobBoard, 'id');
    await seedCollection('team', teamMembers, 'id');
    await seedCollection('testimonials', testimonials, 'id');

    console.log('\n🎉 All realistic data seeded successfully!');
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
