
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDMA4TK8FVIsvhWUWVHi2CSBKowzO2T6Xw",
  authDomain: "internshub-bf22c.firebaseapp.com",
  projectId: "internshub-bf22c",
  storageBucket: "internshub-bf22c.appspot.com",
  messagingSenderId: "945657529507",
  appId: "1:945657529507:web:055b90da95e91a60ae6b16",
  measurementId: "G-3K8B9VQFQV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth =getAuth(app);
const provider=new GoogleAuthProvider();
export {auth,provider};
//