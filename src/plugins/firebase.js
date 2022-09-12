import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDBp7fHHx5XpfA7UNogUr9d8VOkLc-Z9Lw',
  authDomain: 'ledo-fyp.firebaseapp.com',
  databaseURL: 'https://ledo-fyp.firebaseio.com',
  projectId: 'ledo-fyp',
  storageBucket: 'ledo-fyp.appspot.com',
  messagingSenderId: '179153107381',
  appId: '1:179153107381:web:aa44768cc157ed68'
}
// Initialize Firebase
const firebase = initializeApp(firebaseConfig)

const firestore = getFirestore(firebase)
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(firebase)

export { firebase, firestore, auth }
