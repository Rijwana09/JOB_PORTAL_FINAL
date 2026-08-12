import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import "./api/axiosInterceptor";

import App from "./App";

import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeContext";

import { AuthProvider } from "./context/AuthContext";


import ErrorBoundary from "./components/Error/ErrorBoundary";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <ErrorBoundary>

      <ThemeProvider>

        <AuthProvider>

        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
        />

        </AuthProvider>

      </ThemeProvider>

    </ErrorBoundary>

  </React.StrictMode>
);