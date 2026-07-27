"use client";

import React, { useState, ReactNode } from "react";
import { Sidebar } from "@/src/components/Dashboard/Sidebar/Sidebar";
import { DNavbar } from "@/src/components/Dashboard/DNavbar/DNavbar";

interface DashboardLayoutProps {
  children?: ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  // 1. Defined functions for state management
  const handleCloseSidebar = () => setSidebarOpen(false);
  const handleOpenSidebar = () => setSidebarOpen(true);

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      {/* Overlay click uses onClose to close mobile menu */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={handleCloseSidebar}
        />
      )}

      {/* Passed handleCloseSidebar as onClose prop */}
      <Sidebar isOpen={sidebarOpen} onClose={handleCloseSidebar} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Passed handleOpenSidebar as onOpenSidebar prop */}
        <DNavbar onOpenSidebar={handleOpenSidebar} />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
