import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"
import "./i18n/i18n"

import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "./components/ThemeProvider"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider>
      <TooltipProvider>
        <App />
      </TooltipProvider>
    </ThemeProvider>
  </React.StrictMode>
)

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(() => console.log("SW registered"))
    .catch((err) => console.log("SW failed:", err));
}
