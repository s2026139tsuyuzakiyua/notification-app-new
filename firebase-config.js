import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";


const firebaseConfig = {

  apiKey: "AIzaSyCvfXVyAT6w3JMc7y1i52nypOVDAoNXuJQ",

  authDomain: "tankyuuapp.firebaseapp.com",

  projectId: "tankyuuapp",

  storageBucket: "tankyuuapp.firebasestorage.app",

  messagingSenderId: "632094128023",

  appId: "1:632094128023:web:fabdd2b4c22923a00ef6d2"

};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);


export { db };
