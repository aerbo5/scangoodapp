import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc,
  addDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';

// User profile
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return { id: userSnap.id, ...userSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user profile:', error);
    throw error;
  }
};

export const createUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { id: userId, ...userData };
  } catch (error) {
    console.error('Error creating user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      ...userData,
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Scanned items / Shopping list
export const getShoppingList = async (userId) => {
  try {
    const itemsRef = collection(db, 'users', userId, 'shoppingList');
    const itemsSnap = await getDocs(itemsRef);
    return itemsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting shopping list:', error);
    throw error;
  }
};

export const addToShoppingList = async (userId, item) => {
  try {
    const itemsRef = collection(db, 'users', userId, 'shoppingList');
    const docRef = await addDoc(itemsRef, {
      ...item,
      createdAt: new Date()
    });
    return { id: docRef.id, ...item };
  } catch (error) {
    console.error('Error adding to shopping list:', error);
    throw error;
  }
};

export const removeFromShoppingList = async (userId, itemId) => {
  try {
    const itemRef = doc(db, 'users', userId, 'shoppingList', itemId);
    await deleteDoc(itemRef);
  } catch (error) {
    console.error('Error removing from shopping list:', error);
    throw error;
  }
};

// Favorites
export const getFavorites = async (userId) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const favoritesSnap = await getDocs(favoritesRef);
    return favoritesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting favorites:', error);
    throw error;
  }
};

export const addFavorite = async (userId, favoriteData) => {
  try {
    const favoritesRef = collection(db, 'users', userId, 'favorites');
    const docRef = await addDoc(favoritesRef, {
      ...favoriteData,
      createdAt: new Date()
    });
    return { id: docRef.id, ...favoriteData };
  } catch (error) {
    console.error('Error adding favorite:', error);
    throw error;
  }
};

export const removeFavorite = async (userId, favoriteId) => {
  try {
    const favoriteRef = doc(db, 'users', userId, 'favorites', favoriteId);
    await deleteDoc(favoriteRef);
  } catch (error) {
    console.error('Error removing favorite:', error);
    throw error;
  }
};

// Products
export const searchProducts = async (searchTerm) => {
  try {
    const productsRef = collection(db, 'products');
    const q = query(
      productsRef,
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff'),
      limit(20)
    );
    const productsSnap = await getDocs(q);
    return productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error searching products:', error);
    throw error;
  }
};

export const getProductDetails = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productSnap = await getDoc(productRef);
    if (productSnap.exists()) {
      return { id: productSnap.id, ...productSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting product details:', error);
    throw error;
  }
};

// Stores
export const getStores = async (latitude, longitude, radius = 10) => {
  try {
    const storesRef = collection(db, 'stores');
    const storesSnap = await getDocs(storesRef);
    // In a real app, you would use GeoFirestore for location-based queries
    return storesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error getting stores:', error);
    throw error;
  }
};

