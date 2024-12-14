// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database'; // Import for Realtime Database

const firebaseConfig = {
  apiKey: "AIzaSyBSuUsCgYzJIegTUusbjXY3YZh3SwKlw9M",
  authDomain: "stocksapp-64c0e.firebaseapp.com",
  projectId: "stocksapp-64c0e",
  storageBucket: "stocksapp-64c0e.appspot.com",
  messagingSenderId: "259190736069",
  appId: "1:259190736069:web:53b28135cc41c2f2889cac",
  databaseURL: "https://stocksapp-64c0e-default-rtdb.firebaseio.com", // Add databaseURL for Realtime DB
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app); // Firestore instance
const rtdb = getDatabase(app); // Realtime Database instance

export { app, auth, db, rtdb }; // Export the Realtime Database instance
