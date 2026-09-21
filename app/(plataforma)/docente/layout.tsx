"use client";

import DashboardShell from "@/components/dashboard/shell";
import { 
  LayoutDashboard
} from "lucide-react";

const docenteNavItems = [
  {
    title: "Dashboard",
    href: "/docente/dashboard",
    icon: LayoutDashboard,
  },
];

import RoleGuard from "@/components/auth/role-guard";

export default function DocenteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RoleGuard allowedRoles={['docente', 'admin']}>
      <DashboardShell navItems={docenteNavItems} title="Portal del Docente">
        {children}
      </DashboardShell>
    </RoleGuard>
  );
}
