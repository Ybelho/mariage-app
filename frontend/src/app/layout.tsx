import "./globals.css";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Mariage",
  description: "Charlotte & Yanni",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="app-body">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
