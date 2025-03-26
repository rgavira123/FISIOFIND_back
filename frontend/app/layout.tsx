// app/layout.tsx (o el nombre que uses para tu RootLayout en Next.js 13+)
import './globals.css';
import { Poppins } from 'next/font/google';
import { Metadata } from 'next';
import Script from 'next/script';
import {SidebarDemo} from '@/components/sidebar-demo';
import {ClientWrapper} from '@/components/ClientWrapper';

// Importa el AppointmentProvider
import { AppointmentProvider } from "@/context/appointmentContext";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: 'FisioFind',
  description: 'Find your physiotherapist',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script
          src="https://animatedicons.co/scripts/embed-animated-icons.js"
          strategy="afterInteractive"
        />
      </head>
      <body
        className={`${poppins.variable} font-sans antialiased`}
        style={{ backgroundColor: "rgb(238, 251, 250)" }}
      >
        {/* Envolvemos todo con el AppointmentProvider */}
        <AppointmentProvider>
          <div className="flex min-h-screen">
            <SidebarDemo />
            <main className="flex-1 transition-all duration-300 ml-[20px] p-6 h-screen overflow-auto">
              <div className="w-full min-h-full rounded-xl border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-800 p-6">
                {children}
              </div>
            </main>
          </div>
        </AppointmentProvider>
      </body>
    </html>
  );
}
