import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where 
} from 'firebase/firestore';

// User operations
export const createUser = async (userData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'users'), userData);
    return { id: docRef.id, ...userData };
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const getUser = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error) {
    console.error('Error getting user:', error);
    throw error;
  }
};

// Project operations
export const createProject = async (projectData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'projects'), projectData);
    return { id: docRef.id, ...projectData };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

export const getProjects = async (userId: string) => {
  try {
    const q = query(collection(db, 'projects'), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting projects:', error);
    throw error;
  }
};

// Keyword operations
export const createKeyword = async (keywordData: any) => {
  try {
    const docRef = await addDoc(collection(db, 'keywords'), keywordData);
    return { id: docRef.id, ...keywordData };
  } catch (error) {
    console.error('Error creating keyword:', error);
    throw error;
  }
};

export const getKeywords = async (projectId: string) => {
  try {
    const q = query(collection(db, 'keywords'), where('projectId', '==', projectId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting keywords:', error);
    throw error;
  }
};

// Notification operations
export const updateNotification = async (notificationId: string, userId: string, updateData: any) => {
  try {
    const q = query(collection(db, 'notifications'), where('id', '==', notificationId), where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error('Notification not found or unauthorized');
    }
    const docRef = doc(db, 'notifications', querySnapshot.docs[0].id);
    await updateDoc(docRef, updateData);
    return { id: docRef.id, ...updateData };
  } catch (error) {
    console.error('Error updating notification:', error);
    throw error;
  }
}; 