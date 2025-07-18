import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // your root component
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./Stores/Store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
