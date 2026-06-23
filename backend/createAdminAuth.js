const { initializeApp } = require('firebase/app');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyDWYbdHz52hKhCt4L4o4MKx2Oe5aNPl-ts",
  authDomain: "mygarage-thiva.firebaseapp.com",
  projectId: "mygarage-thiva",
  storageBucket: "mygarage-thiva.firebasestorage.app",
  messagingSenderId: "197340792434",
  appId: "1:197340792434:web:07ff1c3717e8b3c3dce4eb"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const email = 'admin@mygarage.com';
const password = 'admin@123';

async function createAdmin() {
  try {
    console.log(`Setting up Admin Authentication for ${email}...`);
    // Attempt to create the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log(`✅ Success! Admin account created. Email: ${email}, UID: ${userCredential.user.uid}`);
    process.exit(0);
  } catch (error) {
    if (error.code === 'auth/email-already-in-use') {
      console.log('Account already exists! Attempting to update or verify...');
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('✅ Admin account verified successfully with the new password!');
      } catch (signInError) {
        console.error('❌ Could not sign in. You may need to delete the user in Firebase Auth console first to reset the password this way.', signInError.message);
      }
    } else if (error.code === 'auth/operation-not-allowed') {
      console.error('❌ ERROR: Email/Password authentication is disabled in your Firebase project!');
      console.error('--> Go to Firebase Console -> Authentication -> Sign-in method -> Enable "Email/Password"');
    } else {
      console.error('❌ Error creating admin auth:', error.code, error.message);
    }
    process.exit(1);
  }
}

createAdmin();
