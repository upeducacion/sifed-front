"use client";

import { useState } from "react";
import { DashboardSidebar, NavItem } from "./sidebar";
import { DashboardHeader } from "./header";

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title?: string;
}

export default function DashboardShell({ children, navItems, title }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-50/30">
      <DashboardSidebar items={navItems} open={sidebarOpen} setOpen={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <DashboardHeader setSidebarOpen={setSidebarOpen} title={title} />
        
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="mx-auto max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
