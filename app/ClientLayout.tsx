"use client";

import { usePathname } from "next/navigation";
import HeaderWrapper from "./header/HeaderProps";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const hideHeader = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideHeader && <HeaderWrapper />}
      {children}
    </>
  );
}
