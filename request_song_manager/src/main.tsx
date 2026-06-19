import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "@/assets/font/飞波正点体.ttf";
import App from "./App.tsx";
import { loadFont } from "@/utils";

loadFont().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
