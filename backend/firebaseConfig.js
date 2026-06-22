const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyDWYbdHz52hKhCt4L4o4MKx2Oe5aNPl-ts",
  authDomain: "mygarage-thiva.firebaseapp.com",
  projectId: "mygarage-thiva",
  storageBucket: "mygarage-thiva.firebasestorage.app",
  messagingSenderId: "197340792434",
  appId: "1:197340792434:web:07ff1c3717e8b3c3dce4eb"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { db };
