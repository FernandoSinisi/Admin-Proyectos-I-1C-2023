import { initializeApp } from "firebase/app";
import {addDoc, collection, initializeFirestore} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAQiqsGxiRsHokzhxxCTwS-J-AMVgVXPKg",
  authDomain: "cuidalacasa-307f2.firebaseapp.com",
  projectId: "cuidalacasa-307f2",
  storageBucket: "cuidalacasa-307f2.appspot.com",
  messagingSenderId: "273240644813",
  appId: "1:273240644813:web:0b1115815224c4d0f5dd84",
  measurementId: "G-D4XWND8FEN"
};

const app = initializeApp(firebaseConfig);
const db = initializeFirestore(app, {useFetchStreams: false, experimentalForceLongPolling: true});

const addDocIntoCollection = async (collectionName, newDoc) => {
  try {
    await addDoc(collection(db, collectionName), newDoc);
  } catch (err) {
    alert(err);
  }
}

export {db, addDocIntoCollection};
