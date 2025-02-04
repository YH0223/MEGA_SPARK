import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; // ✅ 추가

const queryClient = new QueryClient(); // ✅ QueryClient 인스턴스 생성

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}> {/* ✅ QueryClientProvider 추가 */}
      <App />
    </QueryClientProvider>
  </StrictMode>
);