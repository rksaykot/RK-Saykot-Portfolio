import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCz-akL6zei0AiW8oWrHxZ6Hu3GZKnXxiI",
  authDomain: "saykots-portfolio.firebaseapp.com",
  projectId: "saykots-portfolio",
  storageBucket: "saykots-portfolio.firebasestorage.app",
  messagingSenderId: "799270870399",
  appId: "1:799270870399:web:7b7a3e63d84f2090f0ce4a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
