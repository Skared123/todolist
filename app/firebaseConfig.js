
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCSa8-rbaQx0lHekgshTdwkxbGcwptwgQw",
  authDomain: "todolist-9492f.firebaseapp.com",
  projectId: "todolist-9492f",
  storageBucket: "todolist-9492f.appspot.com",
  messagingSenderId: "210022248309",
  appId: "1:210022248309:web:c7dc2d32526873bec8ad3c",
  measurementId: "G-42G724Y21Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};