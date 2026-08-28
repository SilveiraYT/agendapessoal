import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAsDX2DMyerhdqdnKnsdozjRUpM2PuZxnQ",
  authDomain: "agendamentos-kah-marcia.firebaseapp.com",
  projectId: "agendamentos-kah-marcia",
  storageBucket: "agendamentos-kah-marcia.firebasestorage.app",
  messagingSenderId: "1058828207039",
  appId: "1:1058828207039:web:4e7a1534e0b645659c170a",
  measurementId: "G-42BVH9MWEF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);
