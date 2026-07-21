import HealthFooter from "@/src/components/shared/Footer/Footer";
import Navbar from "@/src/components/shared/Navbar/Navbar";
import React from "react";

const CommonLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1 ">{children}</main>
      <HealthFooter />
    </div>
  );
};

export default CommonLayout;
