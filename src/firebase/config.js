import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBoAdSWKySJTn4xQV-B-DY-m7W3SV1THg4",
    authDomain: "time-tracker-d3c89.firebaseapp.com",
    projectId: "time-tracker-d3c89",
    storageBucket: "time-tracker-d3c89.appspot.com",
    messagingSenderId: "936409989120",
    appId: "1:936409989120:web:59d81f77742e633a86d8e5"
};

const app = initializeApp(firebaseConfig);
export default app;