import "./globals.css";

export const metadata = {
  title: "DIMNY",
  description: "Creator Platform",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}