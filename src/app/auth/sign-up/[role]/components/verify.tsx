// "use client";

// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Separator } from "@/components/ui/separator";
// import { ArrowLeft, Mail } from "lucide-react";
// import { useCallback, useEffect, useRef, useState, useTransition } from "react";
// import toast from "react-hot-toast";
// import { OTPCountdown } from "./resend-button";

// interface VerifyOTPProps {
//   email: string;
//   onBack: () => void;
// }

// const OTP_LENGTH = 6;
// const RESEND_TIMEOUT = 60;

// const VerifyOTP = ({ email, onBack }: VerifyOTPProps) => {
//   const [otpValues, setOtpValues] = useState<string[]>(
//     Array(OTP_LENGTH).fill("")
//   );
//   const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const [countdown, setCountdown] = useState(RESEND_TIMEOUT);
//   const [isVerifyingOTP, startOTPTransition] = useTransition();

//   const focusOTPInput = useCallback(
//     (index: number) => otpInputRefs.current[index]?.focus(),
//     []
//   );

//   // Countdown
//   useEffect(() => {
//     if (countdown <= 0) return;
//     const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
//     return () => clearTimeout(timer);
//   }, [countdown]);

//   const handleOTPChange = useCallback(
//     (index: number, value: string) => {
//       if (value.length > 1 || (value && !/^\d$/.test(value))) return;
//       const newOtp = [...otpValues];
//       newOtp[index] = value;
//       setOtpValues(newOtp);
//       if (value && index < OTP_LENGTH - 1) focusOTPInput(index + 1);
//     },
//     [otpValues, focusOTPInput]
//   );

//   const handleOTPKeyDown = useCallback(
//     (index: number, e: React.KeyboardEvent) => {
//       if (e.key === "Backspace" && !otpValues[index] && index > 0)
//         focusOTPInput(index - 1);
//     },
//     [otpValues, focusOTPInput]
//   );

//   const handleOTPPaste = useCallback(
//     (e: React.ClipboardEvent) => {
//       e.preventDefault();
//       const pasted = e.clipboardData
//         .getData("text")
//         .slice(0, OTP_LENGTH)
//         .split("")
//         .filter((c) => /^\d$/.test(c));
//       const newOtp = [...otpValues];
//       pasted.forEach((digit, i) => (newOtp[i] = digit));
//       setOtpValues(newOtp);
//       const nextEmpty = newOtp.findIndex((v) => !v);
//       focusOTPInput(nextEmpty !== -1 ? nextEmpty : OTP_LENGTH - 1);
//     },
//     [otpValues, focusOTPInput]
//   );

//   const handleVerifyOTP = useCallback(() => {
//     const otpCode = otpValues.join("");
//     if (otpCode.length !== OTP_LENGTH) return toast.error("Enter complete OTP");

//     startOTPTransition(async () => {
//       try {
//         const result = true;
//         if (result) {
//           toast.success("Email verified successfully!");
//           window.location.href = "/auth/sign-in";
//         } else {
//           toast.error(result || "Invalid OTP");
//           setOtpValues(Array(OTP_LENGTH).fill(""));
//           focusOTPInput(0);
//         }
//       } catch (err) {
//         console.error(err);
//         toast.error("Verification failed");
//       }
//     });
//   }, [otpValues, email, focusOTPInput]);

//   const handleResendOTP = useCallback(async () => {
//     if (countdown > 0) return;
//     try {
//       const result = true;
//       if (result) {
//         toast.success("OTP resent successfully");
//         setOtpValues(Array(OTP_LENGTH).fill(""));
//         setCountdown(RESEND_TIMEOUT);
//         focusOTPInput(0);
//       } else {
//         toast.error(result || "Failed to resend OTP");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Failed to resend OTP");
//     }
//   }, [countdown, email, focusOTPInput]);

//   return (
//     <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
//       <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
//         <div className="flex flex-col items-center gap-4 text-center mb-6">
//           <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
//             <Mail className="h-8 w-8 text-blue-600" />
//           </div>
//           <h2 className="text-3xl font-bold text-gray-800">
//             Verify Your Email
//           </h2>
//           <p className="text-sm text-gray-600">
//             We&apos;ve sent a 6-digit code to <br />
//             <span className="font-medium text-blue-600">{email}</span>
//           </p>
//         </div>

//         <Separator className="my-6 bg-blue-100" />

//         <div className="flex justify-center gap-3 mb-6">
//           {otpValues.map((value, index) => (
//             <Input
//               key={index}
//               ref={(el) => {
//                 otpInputRefs.current[index] = el;
//               }}
//               type="text"
//               maxLength={1}
//               value={value}
//               onChange={(e) => handleOTPChange(index, e.target.value)}
//               onKeyDown={(e) => handleOTPKeyDown(index, e)}
//               onPaste={handleOTPPaste}
//               className="h-14 w-12 text-center text-xl border-2 focus:border-blue-500"
//             />
//           ))}
//         </div>

//         <OTPCountdown countdown={countdown} onResend={handleResendOTP} />

//         <div className="space-y-3 mt-6">
//           <Button
//             onClick={handleVerifyOTP}
//             className="w-full py-3 bg-blue-600 text-white hover:bg-blue-700"
//           >
//             Verify Email
//           </Button>
//           <Button
//             variant="ghost"
//             onClick={onBack}
//             className="w-full py-3 text-gray-600 hover:text-gray-800"
//           >
//             <ArrowLeft className="inline-block mr-2 h-4 w-4" /> Back to
//             Registration
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default VerifyOTP;
