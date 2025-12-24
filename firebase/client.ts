// Import the functions you need from the SDKs you need
import {initializeApp, getApp, getApps} from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCP40oiIS9iNOjOyoV9oFBGf68jzoyqSHs",
  authDomain: "interviewprep-1e573.firebaseapp.com",
  projectId: "interviewprep-1e573",
  storageBucket: "interviewprep-1e573.firebasestorage.app",
  messagingSenderId: "892425926483",
  appId: "1:892425926483:web:8c931c7d76ef02a10693a6",
  measurementId: "G-E1CNPMXTXG"
};
let firebaseApp;
try {
  if (!getApps().length) {
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    firebaseApp = getApp();
  }
} catch (error) {
  console.error("Error initializing Firebase:", error);
  throw new Error("Failed to initialize Firebase");
}

// Only export if initialization was successful
export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);