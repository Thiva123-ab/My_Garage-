const { db } = require('./firebaseConfig');
const { collection, getDocs, deleteDoc, doc } = require('firebase/firestore');

async function clearJobs() {
  console.log('Clearing all dummy jobs from Firestore...');
  try {
    const snapshot = await getDocs(collection(db, 'jobs'));
    for (const document of snapshot.docs) {
      await deleteDoc(doc(db, 'jobs', document.id));
      console.log('Deleted dummy job:', document.id);
    }
    console.log('✅ All dummy jobs cleared successfully!');
  } catch (error) {
    console.error('Error clearing jobs:', error.message);
  }
  process.exit(0);
}

clearJobs();
