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
import { GameContextProvider } from "./context/GameContext.tsx";
import { AudioContextProvider } from "./context/AudioContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <SocketContextProvider>
          <AudioContextProvider>
            <AnimationContextProvider>
              <GameContextProvider>
                <App />
              </GameContextProvider>
            </AnimationContextProvider>
          </AudioContextProvider>
        </SocketContextProvider>
        <ToastContainer />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
