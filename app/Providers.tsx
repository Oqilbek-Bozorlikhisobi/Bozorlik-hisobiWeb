"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "../lib/i18n"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css";

function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </QueryClientProvider>
  );
}

export default Providers;
