// Import Firebase dependencies
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your Firebase config object (replace with your actual Firebase project details)
const firebaseConfig = {
  apiKey: "AIzaSyCXx4-4zpjt0C6em8ZmhVruGYHc9AJsENs",
  authDomain: "visit-app-98ce3.firebaseapp.com",
  databaseURL: "https://visit-app-98ce3-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "visit-app-98ce3",
  storageBucket: "visit-app-98ce3.firebasestorage.app",
  messagingSenderId: "253059760151",
  appId: "1:253059760151:web:3a726e6c9414969076dc52",
  measurementId: "G-J94K7M9HF0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get a reference to the Realtime Database
const db = getDatabase(app);

// Export the db as default
export default db;
