// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCLn8R7t3EEBkGQUKcTEO8ANKG2yFctoe0",
  authDomain: "pushnotifications-a8673.firebaseapp.com",
  projectId: "pushnotifications-a8673",
  storageBucket: "pushnotifications-a8673.firebasestorage.app",
  messagingSenderId: "117319258290",
  appId: "1:117319258290:web:961dfbf0ac8266751c79ab",
  measurementId: "G-8RMCGSD7WX"
};


const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);

// Ask for permission and register SW
// export async function initNotification() {
//   try {
//     // const permission = await Notification.requestPermission();
//     // if (permission !== "granted") return;

//     const token = await getToken(messaging, {
//       vapidKey:"BHjqGZ_VOIiL8J_eP0d0ItBM6QaMT-CPU_deVlrylndYviHOt14BnAvEet0PajIujAj4GI2Wf7hXFvI9WSHdNK8",
//       serviceWorkerRegistration: await navigator.serviceWorker.register("/firebase-messaging-sw.js"),
//     });

//     console.log("FCM Token:", token);
//   } catch (err) {
//     console.error("FCM error", err);
//   }
// }

export { messaging, getToken, onMessage };