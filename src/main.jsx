import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { SkinProvider } from "./context/SkinContext"; // Import SkinProvider

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <SkinProvider> {/* Wrap App with SkinProvider */}
      <App />
    </SkinProvider>
  </StrictMode>
);