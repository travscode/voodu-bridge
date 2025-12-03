import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Voodu ElevenLabs Bridge",
  description: "Proxy Next.js API routes that mirror ElevenLabs endpoints"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
