const { db } = require('./firebaseConfig');
const { collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

async function clearCollection(name) {
  console.log(`Clearing collection: ${name}...`);
  const snapshot = await getDocs(collection(db, name));
  let count = 0;
  for (const document of snapshot.docs) {
    await deleteDoc(doc(db, name, document.id));
    count++;
  }
  console.log(`Deleted ${count} documents from ${name}.`);
}

async function clearDB() {
  console.log('⚠️ Wiping entire database...');
  try {
    await clearCollection('services');
    await clearCollection('jobs');
    await clearCollection('team');
    await clearCollection('testimonials');
    console.log('✅ Database wiped successfully!');
  } catch (error) {
    console.error('Error wiping database:', error.message);
  }
  process.exit(0);
}

clearDB();
