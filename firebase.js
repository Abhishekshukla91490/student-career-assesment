// Firebase App (modular SDK v10 - latest stable)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBlrdZu5MWd0Uet2nrqKIjOZTOW6a-agdI",
  authDomain: "student-career-assessment.firebaseapp.com",
  projectId: "student-career-assessment",
  storageBucket: "student-career-assessment.firebasestorage.app",
  messagingSenderId: "7575959378",
  appId: "1:7575959378:web:4ea3b1ea8aa5ed9420ec8b",
  measurementId: "G-1PX1L4MMTE",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
