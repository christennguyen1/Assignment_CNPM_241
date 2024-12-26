// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDJsnu7rR9XufgiACyJRZjtlkBwjwfhjWo",
    authDomain: "hcmut-ssps-57a67.firebaseapp.com",
    projectId: "hcmut-ssps-57a67",
    storageBucket: "hcmut-ssps-57a67.firebasestorage.app",
    messagingSenderId: "1038124862369",
    appId: "1:1038124862369:web:a7201a64b7d504808d59e0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const fireDB = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { fireDB, storage, auth };