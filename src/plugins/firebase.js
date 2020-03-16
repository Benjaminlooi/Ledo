// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
import * as firebase from "firebase/app";
// Add the Firebase services that you want to use
import "firebase/auth";
import "firebase/firestore";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDBp7fHHx5XpfA7UNogUr9d8VOkLc-Z9Lw",
  authDomain: "ledo-fyp.firebaseapp.com",
  databaseURL: "https://ledo-fyp.firebaseio.com",
  projectId: "ledo-fyp",
  storageBucket: "ledo-fyp.appspot.com",
  messagingSenderId: "179153107381",
  appId: "1:179153107381:web:aa44768cc157ed68"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const firestore = firebase.firestore();

export { firebase, firestore };
