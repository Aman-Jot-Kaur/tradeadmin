// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Import for Realtime Database
const firebaseConfig = {
  apiKey: "AIzaSyCAWrC9O9P1GS5jw2YD71WZcusWBI0kRSU",
  authDomain: "santoshblackbull.firebaseapp.com",
  projectId: "santoshblackbull",
  storageBucket: "santoshblackbull.firebasestorage.app",
  messagingSenderId: "581138445793",
  appId: "1:581138445793:web:ab025eb58f07053a430ea0"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore instance
const rtdb = getDatabase(app); // Realtime Database instance

export { app, auth, db, rtdb }; // Export the Realtime Database instance
