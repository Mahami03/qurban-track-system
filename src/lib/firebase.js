import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDb4kFdLS_mL72wbISNwNGvyMu37kEyiVY",
    authDomain: "qurban-tracking.firebaseapp.com",
    projectId: "qurban-tracking",
    storageBucket: "qurban-tracking.firebasestorage.app",
    messagingSenderId: "1008182360877",
    appId: "1:1008182360877:web:9c8cb246c04d27f12731a4",
    measurementId: "G-26YL2160CC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
