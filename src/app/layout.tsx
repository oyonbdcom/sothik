import ReduxProvider from "@/provider/auth.provicer";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </head>

      <body>
        <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@300;400;500;600;700&display=swap');
        * { font-family: 'Hind Siliguri', 'Noto Sans Bengali', sans-serif; }
        .hero-gradient { background: linear-gradient(135deg, #EFF6FF 0%, #EEF2FF 50%, #F0FDF4 100%); }
        .dot-pattern { background-image: radial-gradient(circle, #bfdbfe 1px, transparent 1px); background-size: 28px 28px; }
        .card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .card-hover:hover { transform: translateY(-4px); box-shadow: 0 20px 40px -12px rgba(0,0,0,0.12); }
        .tab-active { background: #1d4ed8; color: white; }
        .tab-inactive { background: white; color: #64748b; border: 1px solid #e2e8f0; }
        .tab-inactive:hover { border-color: #93c5fd; color: #1d4ed8; }
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        .float { animation: float 4s ease-in-out infinite; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        .fade-up { animation: fadeUp 0.6s ease forwards; }
        .pulse-dot::before { content:''; position:absolute; inset:0; border-radius:50%; background:inherit; animation: ping 1.5s cubic-bezier(0,0,0.2,1) infinite; opacity:0.4; }
        @keyframes ping { 75%,100%{transform:scale(2);opacity:0} }
      `}</style>
        <ReduxProvider>{children}</ReduxProvider>
        <Toaster />
      </body>
    </html>
  );
}
