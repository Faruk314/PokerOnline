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
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
          icon={false}
          toastClassName="!bg-gradient-to-br !from-gray-900/90 !to-gray-950/90 !backdrop-blur-xl !border !border-white/10 !rounded-2xl !shadow-2xl"
          bodyClassName="!text-white !font-medium"
          progressClassName="!bg-gradient-to-r !from-yellow-500 !to-amber-500"
        />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
