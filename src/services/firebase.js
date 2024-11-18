// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBSuUsCgYzJIegTUusbjXY3YZh3SwKlw9M",
  authDomain: "stocksapp-64c0e.firebaseapp.com",
  projectId: "stocksapp-64c0e",
  storageBucket: "stocksapp-64c0e.appspot.com",
  messagingSenderId: "259190736069",
  appId: "1:259190736069:web:53b28135cc41c2f2889cac"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const firebase=app
export { app, auth, db, firebase };
