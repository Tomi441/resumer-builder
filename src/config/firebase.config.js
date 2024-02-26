import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCMneUEs0doWA_HGgEigYu7pckM7OlgLEk",
  authDomain: "resume-builder-yt.firebaseapp.com",
  projectId: "resume-builder-yt",
  storageBucket: "resume-builder-yt.appspot.com",
  messagingSenderId: "168931451225",
  appId: "1:168931451225:web:0309e70e157ae002cdac48",
};

const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, auth, storage };
