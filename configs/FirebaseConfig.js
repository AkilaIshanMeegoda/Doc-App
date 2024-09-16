// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDpwHH2wizIxgvVvKXqjzjpKo-_Cff7klg",
  authDomain: "doc-app-c9683.firebaseapp.com",
  projectId: "doc-app-c9683",
  storageBucket: "doc-app-c9683.appspot.com",
  messagingSenderId: "900880389744",
  appId: "1:900880389744:web:dacc67faeaefea96fa06b5"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db=getFirestore(app)
export const storage= getStorage(app)