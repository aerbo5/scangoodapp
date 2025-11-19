import { 
  signInWithPhoneNumber, 
  signInWithCredential,
  PhoneAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../config/firebase';

// Phone authentication
export const sendVerificationCode = async (phoneNumber) => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please configure Firebase.');
  }
  try {
    const confirmation = await signInWithPhoneNumber(auth, phoneNumber);
    return confirmation;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

// Verify phone code
export const verifyPhoneCode = async (confirmation, code) => {
  if (!auth) {
    throw new Error('Firebase Auth is not initialized. Please configure Firebase.');
  }
  try {
    const result = await confirmation.confirm(code);
    return result.user;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  if (!auth) {
    return; // Silently return if auth is not initialized
  }
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth?.currentUser || null;
};

// Auth state listener
export const onAuthStateChange = (callback) => {
  if (!auth) {
    // Return a mock unsubscribe function if auth is not initialized
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
};

