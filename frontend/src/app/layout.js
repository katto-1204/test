import './globals.css';

export const metadata = {
  title: 'TaskTracker',
  description: 'Manage your tasks efficiently',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  );
}
