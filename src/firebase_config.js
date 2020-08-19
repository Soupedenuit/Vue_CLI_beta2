const firebaseConfig = {
  apiKey: "AIzaSyAaH_jQLWULqzWupmztJPAMbWNyrzyHfpo",
  authDomain: "vue-beta2.firebaseapp.com",
  databaseURL: "https://vue-beta2.firebaseio.com",
  projectId: "vue-beta2",
  storageBucket: "vue-beta2.appspot.com",
  messagingSenderId: "55695156010",
  appId: "1:55695156010:web:0ffe036757d387bc4cf453",
  measurementId: "G-0TPDNKNGKP"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// NO LONGER WORKING (AUG 16 2020)
// "Uncaught TypeError: firebase.analytics is not a function"
// firebase.analytics(); 

// Firebase Authentication setup
const auth = firebase.auth();
bluesky.auth = auth; //global access to auth

//Persistence "SESSION" indicates that the state will only persist in the current session or tab, and will be cleared when the tab or window in which the user authenticated is closed. Applies only to web apps:
auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
  
auth.onAuthStateChanged(user => {
  if (user) {
    console.log(`Welcome ${user.displayName}!`);
  } else console.log('logged out');
});

// Firebase Realtime Database setup
const database = firebase.database();
bluesky.database = database; //global access to database

// Firebase Storage setup
// Not available in Node.js
// const storage = firebase.storage();
// bluesky.storage = storage; //global access to storage


export {auth, database}
// export {auth, database, storage}