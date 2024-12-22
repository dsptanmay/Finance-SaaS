import Header from "@/components/header";
import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="px-3 lg:px-14">
        {children}
        <ReactQueryDevtools initialIsOpen={false} position="right" />
      </main>
    </>
  );
}

export default DashboardLayout;
