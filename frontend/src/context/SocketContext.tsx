import { createContext, ReactNode, useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAppSelector } from "../store/hooks";

type SocketContextData = {
  socket: Socket | null;
};

const initialSocketContextData: SocketContextData = {
  socket: null,
};

export const SocketContext = createContext<SocketContextData>(
  initialSocketContextData
);

type SocketContextProviderProps = {
  children: ReactNode;
};

export const SocketContextProvider = ({
  children,
}: SocketContextProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { loggedUserInfo } = useAppSelector((state) => state.auth);

  const getCookie = (name: string) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(";");

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        const value = cookie.substring(name.length + 1);

        return decodeURIComponent(value);
      }
    }

    return null;
  };

  const socketInstance = useMemo(() => {
    if (loggedUserInfo) {
      const socket = io("http://192.168.10.114:5001", {
        transports: ["websocket"],
        auth: { token: getCookie("token") },
        autoConnect: false,
      });
      socket.connect();
      return socket;
    }
    return null;
  }, [loggedUserInfo]);

  useEffect(() => {
    if (socketInstance) {
      setSocket(socketInstance);

      return () => {
        socketInstance.disconnect();
        setSocket(null);
      };
    }
  }, [socketInstance]);

  const contextValue: SocketContextData = {
    socket,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
