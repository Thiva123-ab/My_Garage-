const { db } = require('./firebaseConfig');
const { collection, addDoc, setDoc, doc } = require('firebase/firestore');

const users = [
  // Admins
  {
    id: 'admin_1',
    name: 'Super Admin',
    email: 'admin@mygarage.com',
    role: 'admin',
    phone: '+94 77 000 0000',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  // Service Advisors / Staff
  {
    id: 'advisor_1',
    name: 'Kamal Perera',
    email: 'kamal.advisor@mygarage.com',
    role: 'service_advisor',
    phone: '+94 71 111 1111',
    department: 'Service Desk',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'mechanic_1',
    name: 'Michael Thompson',
    email: 'michael.t@mygarage.com',
    role: 'mechanic',
    phone: '+94 78 444 4444',
    specialty: 'Master Diagnostic Tech',
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  // Customers
  {
    id: 'customer_1',
    name: 'Thivanka Tharuka',
    email: 'thivanka@example.com',
    role: 'customer',
    phone: '+94 75 222 2222',
    address: '123 Main Street, Colombo',
    vehicles: ['2018 Toyota Premio', '2021 Honda Civic'],
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'customer_2',
    name: 'Nimal Fernando',
    email: 'nimal.f@example.com',
    role: 'customer',
    phone: '+94 72 333 3333',
    address: '45 Kandy Road, Kadawatha',
    vehicles: ['2022 BMW 320d'],
    createdAt: new Date().toISOString(),
    status: 'active'
  },
  {
    id: 'customer_3',
    name: 'Samantha Silva',
    email: 'samantha.s@example.com',
    role: 'customer',
    phone: '+94 76 999 8888',
    address: '88 Galle Road, Mount Lavinia',
    vehicles: ['2019 Nissan Leaf'],
    createdAt: new Date().toISOString(),
    status: 'active'
  }
];

async function seedUsers() {
  console.log('🚀 Seeding users with different roles to Firestore...');
  try {
    for (const user of users) {
      // Using setDoc with a specific ID instead of addDoc to make it easier to identify
      const userRef = doc(db, 'users', user.id);
      await setDoc(userRef, user);
      console.log(`  ✅ Added ${user.role}: ${user.name} (Doc ID: ${user.id})`);
    }
    console.log('\n🎉 Users seeded successfully! Check the "users" collection in Firebase.');
  } catch (error) {
    console.error('❌ Error seeding users:', error.message);
  }
  process.exit(0);
}

seedUsers();
