import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Default } from "./pages/Default.tsx";
import { Brain } from "./pages/Brain.tsx";
import { AppConfigProvider } from "./context/AppConfigProvider.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Default />
      },
      {
        path: "/brain",
        element: <Brain />
      }
    ]
  }
]);

createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <AppConfigProvider>
      <RouterProvider router={router} />
    </AppConfigProvider>
  </StrictMode>
);
