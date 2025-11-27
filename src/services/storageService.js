import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../config/firebase';

// Upload image
export const uploadImage = async (userId, imageUri, folder = 'images') => {
  try {
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const fileName = `${userId}_${Date.now()}.jpg`;
    const storageRef = ref(storage, `${folder}/${fileName}`);
    
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (userId, imageUri) => {
  return uploadImage(userId, imageUri, 'profilePictures');
};

// Upload scanned receipt
export const uploadReceipt = async (userId, imageUri) => {
  return uploadImage(userId, imageUri, 'receipts');
};

// Upload scanned product
export const uploadProductImage = async (userId, imageUri) => {
  return uploadImage(userId, imageUri, 'products');
};

// Delete image
export const deleteImage = async (imagePath) => {
  try {
    const imageRef = ref(storage, imagePath);
    await deleteObject(imageRef);
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};




