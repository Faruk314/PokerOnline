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

  const socketInstance = useMemo(() => {
    if (loggedUserInfo?.userId) {
      const socket = io(import.meta.env.VITE_WS_URL, {
        transports: ["websocket"],
        withCredentials: true,
        autoConnect: false,
      });
      socket.connect();
      return socket;
    }
    return null;
  }, [loggedUserInfo?.userId]);

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
