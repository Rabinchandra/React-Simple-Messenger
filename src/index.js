import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import * as firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyCrfbdanIkhtZm_a_9w9hCpSuBw9ja3uh0",
  authDomain: "messenger-users-16604.firebaseapp.com",
  databaseURL: "https://messenger-users-16604.firebaseio.com",
  projectId: "messenger-users-16604",
  storageBucket: "messenger-users-16604.appspot.com",
  messagingSenderId: "115305523405",
  appId: "1:115305523405:web:0c042c112b38cb2908e184",
  measurementId: "G-EBGZ06Z8XV",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

const db = firebase.firestore();

ReactDOM.render(
  <React.StrictMode>
    <App db={db} />
  </React.StrictMode>,
  document.getElementById("root")
);
