import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyDc0_SPxct0SLMgK0EF5m0j--TE0Zb76Bc",
  authDomain: "caculatorhomereceipts-5973b.firebaseapp.com",
  projectId: "caculatorhomereceipts-5973b",
  storageBucket: "caculatorhomereceipts-5973b.appspot.com",
  messagingSenderId: "196277725301",
  appId: "1:196277725301:web:dedf1de3a0eb04bd8eb03c",
  measurementId: "G-J7KP0YR7F4"
};

if(!firebase.apps.length){
  firebase.initializeApp(firebaseConfig)
}
export {firebase}