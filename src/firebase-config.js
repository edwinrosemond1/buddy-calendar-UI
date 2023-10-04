import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore"; // Import necessary Firestore methods

const config = {
  apiKey: "AIzaSyAey-qPSicrLoZRBWglMd8N8QmtmiQL8Fg",
  authDomain: "localhost",
  projectId: "calendar-buddy-bfdf1",
  storageBucket: "gs://calendar-buddy-bfdf1.appspot.com",
  messagingSenderId: "337284482688",
  appId: "YOUR_APP_ID",
};

export const app = initializeApp(config, {
  ignoreUndefinedProperties: true,
});
export const database = getDatabase(app); // Exporting Realtime Database
export const auth = getAuth(app);
export const firestore = getFirestore(app); // Initialize and export Firestore
