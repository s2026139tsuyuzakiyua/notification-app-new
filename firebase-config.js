import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";

import { getStorage } from
  "https://www.gstatic.com/firebasejs/12.19.0/firebase-storage.js";


// Firebaseの設定
const firebaseConfig = {
  // ↓ここにFirebase画面の設定を入れる
  apiKey: "AIzaSyCvfXVyAT6w3JMc7y1i52nypOVDAoNXuJQ",
  authDomain: "tankyuuapp.firebaseapp.comn",
  projectId: "tankyuuapp",
  storageBucket: "tankyuuapp.firebasestorage.app",
  messagingSenderId: "632094128023",
  appId: "1:632094128023:web:fabdd2b4c22923a00ef6d2"
};


// Firebaseを開始
const app = initializeApp(firebaseConfig);


// Firestore
const db = getFirestore(app);


// Storage
const storage = getStorage(app);


// 他のJavaScriptから使えるようにする
export { db, storage };