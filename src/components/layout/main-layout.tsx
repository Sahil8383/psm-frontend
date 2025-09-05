"use client";

import Navbar from "./navbar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-background">
      <Navbar />
      <div>{children}</div>
    </div>
  );
}
