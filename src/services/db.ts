import { v4 as uuidv4 } from 'uuid';
import type { Appointment } from '../types';

// This is a mock DB using localStorage, with an async interface to be easily swapped to Firebase later.
const DB_KEY = 'agendamentos_db';

type Subscriber = (appointments: Appointment[]) => void;
let subscribers: Subscriber[] = [];

// Helper to simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredAppointments = (): Appointment[] => {
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : [];
};

const saveAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(DB_KEY, JSON.stringify(appointments));
  notifySubscribers();
};

const notifySubscribers = () => {
  const data = getStoredAppointments();
  subscribers.forEach(sub => sub(data));
};

// --- CRUD Operations ---

export const getAppointments = async (): Promise<Appointment[]> => {
  await delay(200);
  return getStoredAppointments();
};

export const addAppointment = async (appointment: Omit<Appointment, 'id' | 'createdAt' | 'updatedAt'>): Promise<Appointment> => {
  await delay(300);
  const newAppt: Appointment = {
    ...appointment,
    id: uuidv4(),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
  const current = getStoredAppointments();
  saveAppointments([...current, newAppt]);
  return newAppt;
};

export const updateAppointment = async (id: string, updates: Partial<Appointment>): Promise<Appointment> => {
  await delay(300);
  const current = getStoredAppointments();
  const index = current.findIndex(a => a.id === id);
  if (index === -1) throw new Error('Appointment not found');
  
  const updatedAppt = {
    ...current[index],
    ...updates,
    updatedAt: Date.now(),
  };
  current[index] = updatedAppt;
  saveAppointments(current);
  return updatedAppt;
};

export const deleteAppointment = async (id: string): Promise<void> => {
  await delay(300);
  const current = getStoredAppointments();
  const filtered = current.filter(a => a.id !== id);
  saveAppointments(filtered);
};

// --- Real-time Sync Simulation ---

export const subscribeToAppointments = (callback: Subscriber) => {
  subscribers.push(callback);
  // Trigger initially
  callback(getStoredAppointments());
  
  // Also listen to storage events from other tabs
  const handleStorage = (e: StorageEvent) => {
    if (e.key === DB_KEY) {
      callback(getStoredAppointments());
    }
  };
  window.addEventListener('storage', handleStorage);
  
  return () => {
    subscribers = subscribers.filter(sub => sub !== callback);
    window.removeEventListener('storage', handleStorage);
  };
};
