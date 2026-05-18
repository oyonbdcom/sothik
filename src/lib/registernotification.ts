/* eslint-disable @typescript-eslint/no-explicit-any */
import { axiosInstance } from "@/helper/axios/axiosInstance";
import { getUserInfo } from "@/service/auth.service";
import { getMessaging, getToken, isSupported } from "firebase/messaging";
import { firebaseApp } from "./firebase-app";

export async function registerNotification() {
  if (typeof window === "undefined") return;

  // ১. সার্ভিস ওয়ার্কার এবং পুশ সাপোর্ট চেক
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    console.log("Push messaging is not supported");
    return;
  }

  try {
    const supported = await isSupported();
    if (!supported) return;

    // ২. পারমিশন চেক ও রিকোয়েস্ট
    let permission = Notification.permission;
    if (permission === "default") {
      permission = await Notification.requestPermission();
    }

    if (permission !== "granted") return;

    // ৩. সার্ভিস ওয়ার্কার রেজিস্ট্রেশন নিশ্চিত করা
    const registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
    );

    const messaging = getMessaging(firebaseApp);

    // ৪. টোকেন সংগ্রহ
    const fcmToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration, // রেজিস্ট্রেশন পাস করা ভালো প্র্যাকটিস
    });

    if (!fcmToken) {
      console.error("No FCM token generated");
      return;
    }

    // ৫. ইউজার চেক এবং টোকেন সেভ
    const user = getUserInfo() as any;

    // ইউজার লগইন থাকলে এবং টোকেন থাকলে ডেটাবেজে পাঠানো
    if (user?.userId) {
      await axiosInstance.post("/device-token/register", {
        userId: user.userId,
        token: fcmToken,
        deviceType: "WEB", // অপশনাল: ট্র্যাক রাখার জন্য
      });

      // লোকাল স্টোরেজে সেভ করে রাখতে পারেন যাতে বারবার এপিআই কল না হয়
      localStorage.setItem("fcm_token_registered", "true");
    }
  } catch (error) {
    console.error("Error in notification registration:", error);
  }
}
