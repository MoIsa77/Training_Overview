import "./globals.css";

export const metadata = {
  title: "Corporate Training Overview",
  description: "Training Dashboard and Planning System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-[#1e3a8a] m-0 p-0 overflow-hidden">{children}</body>
    </html>
  );
}
