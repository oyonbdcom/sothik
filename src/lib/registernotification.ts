import { axiosInstance } from "@/helper/axios/axiosInstance";
import { getUserInfo } from "@/service/auth.service";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebaseApp } from "./firebase-app";

export async function registerNotification() {
  if (typeof window === "undefined") return;

  if (!("serviceWorker" in navigator)) return;

  await navigator.serviceWorker.register("/firebase-messaging-sw.js");

  const supported = await isSupported();
  if (!supported) return;

  const permission = await Notification.requestPermission();
  if (permission !== "granted") return;

  const messaging = getMessaging(firebaseApp);

  const fcmToken = await getToken(messaging, {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });

  if (!fcmToken) return;

  const user = getUserInfo();
  console.log(user);
  await axiosInstance.post("/device-token/register", {
    userId: user?.userId,
    token: fcmToken,
  });
}
