import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCeIfNibI5T7c-6yXs9xsvNxgfP6z8JeVE",
  authDomain: "linkedin-clone-f79d1.firebaseapp.com",
  projectId: "linkedin-clone-f79d1",
  storageBucket: "linkedin-clone-f79d1.appspot.com",
  messagingSenderId: "107815808604",
  appId: "1:107815808604:web:905bf81200fee9c029c099"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export {auth,provider};
export default db;