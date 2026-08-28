import type { Appointment } from '../types';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot,
  getDocs 
} from 'firebase/firestore';

const APPOINTMENTS_COLLECTION = 'appointments';

type Subscriber = (appointments: Appointment[]) => void;

// --- CRUD Operations ---

export const getAppointments = async (): Promise<Appointment[]> => {
  const querySnapshot = await getDocs(collection(db, APPOINTMENTS_COLLECTION));
  const appointments: Appointment[] = [];
  querySnapshot.forEach((docSnap) => {
    appointments.push({ id: docSnap.id, ...docSnap.data() } as Appointment);
  });
  return appointments;
};

export const addAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
  const newApptData = {
    ...appointment,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  
  const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), newApptData);
  
  return {
    id: docRef.id,
    ...newApptData
  } as Appointment;
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
  const updatedData = {
    ...updates,
    updatedAt: Date.now(),
  };
  
  await updateDoc(docRef, updatedData);
  
  // Return a mock updated object (in a real scenario we might want to fetch it or build it)
  // For the UI, usually just succeeding is enough, but we return a partial matched object
  return { id, ...updatedData } as Appointment;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  const docRef = doc(db, APPOINTMENTS_COLLECTION, id);
  await deleteDoc(docRef);
};

// --- Real-time Sync ---

export const subscribeToAppointments = (callback: Subscriber) => {
  const q = collection(db, APPOINTMENTS_COLLECTION);
  
  const unsubscribe = onSnapshot(q, (querySnapshot) => {
    const appointments: Appointment[] = [];
    querySnapshot.forEach((docSnap) => {
      appointments.push({ id: docSnap.id, ...docSnap.data() } as Appointment);
    });
    callback(appointments);
  });
  
  return unsubscribe; // Returns the unsubscribe function from Firestore
};
