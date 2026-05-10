import { initializeApp } from "firebase/app";

import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyC2QDQvbWxXM_Vt9AeYOqr3dZbJ3UXgsZI",
  authDomain: "citypulse-2ef8d.firebaseapp.com",
  projectId: "citypulse-2ef8d",
  storageBucket: "citypulse-2ef8d.firebasestorage.app",
  messagingSenderId: "253034843216",
  appId: "1:253034843216:web:94da0549aca8c1cb929555"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
