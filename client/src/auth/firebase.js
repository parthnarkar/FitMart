import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAn0gfxM5UUvuJHqqDxYcJ5NojsuwUYV7o",
  authDomain: "fitmart-app-dbe05.firebaseapp.com",
  projectId: "fitmart-app-dbe05",
  storageBucket: "fitmart-app-dbe05.firebasestorage.app",
  messagingSenderId: "1083470780782",
  appId: "1:1083470780782:web:67f718cc539ef3db50c97f",
  measurementId: "G-LSD2NQ9VM8"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export default app;