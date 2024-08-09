// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, onValue,remove  } from "firebase/database";
import { getStorage,ref as storageRef , uploadBytesResumable, getDownloadURL } from "firebase/storage";



const firebaseConfig = {
  apiKey: "AIzaSyBhqqqgVVcqu3OBYgdCOsTf5JySntvchd4",
  authDomain: "air-smit.firebaseapp.com",
  databaseURL: "https://air-smit-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "air-smit",
  storageBucket: "air-smit.appspot.com",
  messagingSenderId: "952315343970",
  appId: "1:952315343970:web:903bbc593274459f8f0d3b",
  measurementId: "G-41DJFKR6W8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();
const storage = getStorage();


export{
    app,db,ref,set,onValue,remove,getStorage,getDownloadURL,uploadBytesResumable,storage,storageRef
}
