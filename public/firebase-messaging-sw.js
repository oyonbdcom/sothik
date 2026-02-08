importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js",
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js",
);

firebase.initializeApp({
  apiKey: "AIzaSyCSoBG49Q7aC2QaWguC99ZauMbRe_pwO2A",
  authDomain: "assignment-10-67128.firebaseapp.com",
  projectId: "assignment-10-67128",
  messagingSenderId: "595896694756",
  appId: "1:595896694756:web:3a0dfbc6b7093192fa39f1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  self.registration.showNotification(payload.notification.title, {
    body: payload.notification.body,
  });
});
