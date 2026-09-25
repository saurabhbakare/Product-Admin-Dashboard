import "./globals.css";
import { AuthProvider } from "../context/AuthContext";

export const metadata = {
  title: "Product Admin Dashboard | E-Commerce Management",
  description:
    "A modern, responsive product management admin dashboard built with Next.js, React, Tailwind CSS, and Axios using the DummyJSON API.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
