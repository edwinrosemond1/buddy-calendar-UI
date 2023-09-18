// firebaseConfig.js

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const config = {
  apiKey: "AIzaSyAey-qPSicrLoZRBWglMd8N8QmtmiQL8Fg",
  authDomain: "localhost",
  projectId: "calendar-buddy-bfdf1",
  storageBucket: "gs://calendar-buddy-bfdf1.appspot.com",
  messagingSenderId: "337284482688",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(config);
export const auth = getAuth(app);
