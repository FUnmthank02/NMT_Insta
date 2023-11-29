// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1QSpby80VFBGY5t3vfns45vgObzJLODA",
  authDomain: "nmt-insta.firebaseapp.com",
  databaseURL: "https://nmt-insta-default-rtdb.firebaseio.com",
  projectId: "nmt-insta",
  storageBucket: "nmt-insta.appspot.com",
  messagingSenderId: "378407698215",
  appId: "1:378407698215:web:0ffb80ac48d1ac1e797302"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
export { database, ref };