import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
// TODO: Replace with your Firebase project configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase with error handling
let app;
let auth;
let db;
let storage;

try {
  // Only initialize if config is valid (not placeholder values)
  const isConfigValid = firebaseConfig.apiKey && 
    firebaseConfig.apiKey !== "YOUR_API_KEY" &&
    firebaseConfig.projectId !== "YOUR_PROJECT_ID";

  if (isConfigValid) {
    app = initializeApp(firebaseConfig);
    
    // Initialize Auth - getAuth works for both web and React Native
    // For React Native, we can use initializeAuth with AsyncStorage later if needed
    // For now, getAuth works for both platforms
    auth = getAuth(app);

    // Initialize Firestore
    db = getFirestore(app);

    // Initialize Storage
    storage = getStorage(app);
  } else {
    console.warn('⚠️ Firebase not configured. Using mock authentication.');
    // Create mock objects for web compatibility
    auth = null;
    db = null;
    storage = null;
  }
} catch (error) {
  console.warn('⚠️ Firebase initialization error:', error.message);
  auth = null;
  db = null;
  storage = null;
}

export { auth, db, storage };
export default app;

