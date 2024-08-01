import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3sVE0_byZ_XqK_QO2HmMJGUDJ6Ddibj0",
  authDomain: "my-quiz-app-7dfdb.firebaseapp.com",
  projectId: "my-quiz-app-7dfdb",
  storageBucket: "my-quiz-app-7dfdb.appspot.com",
  messagingSenderId: "805272307976",
  appId: "1:805272307976:web:63f5d47b1194f80ed744bd",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth, app };
