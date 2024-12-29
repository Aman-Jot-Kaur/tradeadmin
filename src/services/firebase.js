// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Import for Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyAp-ySGR6zxb2SH9LhcYsEd-YUI8qonR4c",
  authDomain: "blackbull-85321.firebaseapp.com",
  projectId: "blackbull-85321",
  storageBucket: "blackbull-85321.firebasestorage.app",
  messagingSenderId: "780688908051",
  appId: "1:780688908051:web:40ef50e0c35f5d667bc4e6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore instance
const rtdb = getDatabase(app); // Realtime Database instance

export { app, auth, db, rtdb }; // Export the Realtime Database instance
