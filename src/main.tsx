import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from 'react-router';
import { appRouter } from "./router/app.router.tsx";
import { ThemeProvider } from "@/components/theme-provider.tsx";

import { store } from '../src/provider/app/store';
import { Provider } from 'react-redux';

import "./index.css";


createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Provider store={store}>
        <RouterProvider router={appRouter} />
      </Provider>
    </ThemeProvider>
  </StrictMode>
)