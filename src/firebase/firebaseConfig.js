import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDH9Dt9prmyvhddagBo3q9X2RGS7Zs8sxs",
  authDomain: "fila-digital-tcc.firebaseapp.com",
  databaseURL: "https://fila-digital-tcc-default-rtdb.firebaseio.com",
  projectId: "fila-digital-tcc",
  storageBucket: "fila-digital-tcc.firebasestorage.app",
  messagingSenderId: "97615531958",
  appId: "1:97615531958:web:d4ba4fa9ea2d9ad9b2fb17",
  measurementId: "G-F2YDS4D3D0"
};


const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);