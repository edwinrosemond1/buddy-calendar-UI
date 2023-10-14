import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // Import necessary Firestore methods

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

export const app = initializeApp(config, {
  ignoreUndefinedProperties: true,
});
console.log(
  "api key",
  process.env.REACT_APP_API_KEY,
  process.env.projectId,
  process.env
);
export const database = getDatabase(app); // Exporting Realtime Database
export const auth = getAuth(app);
export const firestore = getFirestore(app); // Initialize and export Firestore
