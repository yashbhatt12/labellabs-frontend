import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'LabelLabs - Barcode & RFID Solutions',
  description: 'Premium barcode labels, printers, scanners & RFID solutions for businesses',
  keywords: 'barcode, RFID, labels, printers, scanners, thermal ribbons',
  openGraph: {
    title: 'LabelLabs - Barcode & RFID Solutions',
    description: 'Premium barcode labels, printers, scanners & RFID solutions',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#001A80" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
