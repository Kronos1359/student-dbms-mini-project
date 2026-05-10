import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBs-t4NenTgPqZW9nvE21_1CVY7F4v7fRs",
  authDomain: "student-dbms-f76b3.firebaseapp.com",
  projectId: "student-dbms-f76b3",
  storageBucket: "student-dbms-f76b3.firebasestorage.app",
  messagingSenderId: "972931030312",
  appId: "1:972931030312:web:c74872425482a8a569441d",
  measurementId: "G-5JLKP5W78L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);