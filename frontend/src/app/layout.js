import Navbar from "@/components/Navbar";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'light';
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
                // theme-ready class add karo AFTER theme set ho — transition tab fire hogi
                requestAnimationFrame(function() {
                  requestAnimationFrame(function() {
                    document.documentElement.classList.add('theme-ready');
                  });
                });
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <Toaster />
        {children}
      </body>
    </html>
  );
}
