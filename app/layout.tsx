import "@/app/globals.css";
import type { Metadata } from "next";
import { ClientLayout } from "@/components/ClientLayout";

export const metadata: Metadata = {
  title: "Budget Planner",
  description: "Gestion de budget personnel"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-slate-950 text-slate-50">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}