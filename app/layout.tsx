export const metadata = {
  title: 'Unite Hello',
  description: 'Next.js on Azure App Service',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
