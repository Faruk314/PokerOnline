import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/index.ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SocketContextProvider } from "./context/SocketContext.tsx";
import "./index.css";
import { AnimationContextProvider } from "./context/AnimationContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SocketContextProvider>
          <AnimationContextProvider>
            <App />
          </AnimationContextProvider>
        </SocketContextProvider>
        <ToastContainer />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
