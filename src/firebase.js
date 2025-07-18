// src/firebase.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// ✅ Make sure this config is correct for your project
const firebaseConfig = {
  apiKey: "AIzaSyC3hxvl6JGceZhOwiaH1O7pNo92pWMeEuQ",
  authDomain: "xlmguard.firebaseapp.com",
  projectId: "xlmguard",
  storageBucket: "xlmguard.firebasestorage.app",
  messagingSenderId: "369260793839",
  appId: "1:369260793839:web:0aa74cbe7a3d3dfbb3701a",
  measurementId: "G-3SFLTB94BV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);









