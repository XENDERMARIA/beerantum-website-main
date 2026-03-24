import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#141420",
            color: "#E0E0F0",
            border: "1px solid rgba(139,47,201,0.3)",
            fontFamily: "'Exo 2', sans-serif",
            fontSize: "0.875rem",
          },
          success: { iconTheme: { primary: "#8B2FC9", secondary: "#fff" } },
          error: { iconTheme: { primary: "#EF4444", secondary: "#fff" } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
