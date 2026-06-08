import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Autenticación | UP Educación",
  description: "Acceso seguro a la plataforma UP Educación.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background font-sans antialiased selection:bg-brand-600 selection:text-white">
      {children}
    </div>
  );
}
