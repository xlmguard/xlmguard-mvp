// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyChxvbl6JceZh0iaH107pNo92pWMeEuqQ",
  authDomain: "xlmguard.firebaseapp.com",
  projectId: "xlmguard",
  storageBucket: "xlmguard.appspot.com",
  messagingSenderId: "369260730839",
  appId: "1:369260730839:web:00a7d6be7a3d3dfbb3701a",
  measurementId: "G-3FSLTB94BV"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { app, db };
const auth = getAuth(app); // ✅ Initialize Auth

export { db, auth }; // ✅ Export it for use in login/register

