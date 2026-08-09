import React from "react";
import ReactDOM from "react-dom/client";

import "./index.css";

import App from "./App";

import { Toaster } from "react-hot-toast";

import { ThemeProvider } from "./context/ThemeContext";

import ErrorBoundary from "./components/Error/ErrorBoundary";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>

    <ErrorBoundary>

      <ThemeProvider>

        <App />

        <Toaster
          position="top-right"
          reverseOrder={false}
        />

      </ThemeProvider>

    </ErrorBoundary>

  </React.StrictMode>
);