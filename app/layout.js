export const metadata = {
  title: "The Ten",
  description: "Ten random slots. 24 hours. Every midnight.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0B0B0C" }}>{children}</body>
    </html>
  );
}
