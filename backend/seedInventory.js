const { db } = require('./firebaseConfig');
const { collection, addDoc } = require('firebase/firestore');

const inventoryItems = [
  {
    name: 'Mobil 1 Full Synthetic Oil 5W-30 (5 qt)',
    category: 'Fluids & Oils',
    quantity: 24,
    price: 2999,
    minStock: 10,
    sku: 'OIL-M1-5W30',
    status: 'In Stock'
  },
  {
    name: 'Bosch Premium Oil Filter',
    category: 'Filters',
    quantity: 45,
    price: 450,
    minStock: 15,
    sku: 'FLT-B-OIL-01',
    status: 'In Stock'
  },
  {
    name: 'Brembo Ceramic Front Brake Pads',
    category: 'Brakes',
    quantity: 8,
    price: 5500,
    minStock: 5,
    sku: 'BRK-PAD-F-CER',
    status: 'Low Stock'
  },
  {
    name: 'NGK Iridium Spark Plugs (Set of 4)',
    category: 'Engine Parts',
    quantity: 12,
    price: 2200,
    minStock: 10,
    sku: 'ENG-SPK-NGK',
    status: 'In Stock'
  },
  {
    name: 'Michelin Pilot Sport 4S (245/40R18)',
    category: 'Tires',
    quantity: 2,
    price: 18500,
    minStock: 4,
    sku: 'TIR-MIC-PS4S',
    status: 'Low Stock'
  },
  {
    name: 'Duralast Platinum AGM Battery',
    category: 'Electrical',
    quantity: 0,
    price: 8500,
    minStock: 3,
    sku: 'BAT-AGM-DLP',
    status: 'Out of Stock'
  }
];

async function seedInventory() {
  console.log('🚀 Seeding initial inventory data...');
  try {
    for (const item of inventoryItems) {
      item.createdAt = new Date().toISOString();
      const docRef = await addDoc(collection(db, 'inventory'), item);
      console.log(`  ✅ Added inventory item: ${item.name} (Doc ID: ${docRef.id})`);
    }
    console.log('\n🎉 Inventory seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding inventory:', error.message);
  }
  process.exit(0);
}

seedInventory();
