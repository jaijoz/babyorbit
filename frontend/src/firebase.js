import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAIEqXseDStaWNYIxQNo1JaMKwIaeKNVuw",
  authDomain: "babyorbit.firebaseapp.com",
  projectId: "babyorbit",
  storageBucket: "babyorbit.firebasestorage.app",
  messagingSenderId: "1091443480665",
  appId: "1:1091443480665:web:862e76690bd553d27b3948"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
