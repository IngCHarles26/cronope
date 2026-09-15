import { useEffect, useRef } from "react";
import { useSocketStore } from "../../../lib/store/socket";

export const useSocketEvent = (event: string, callback: (data: any) => void) => {
  const socket = useSocketStore((st) => st.socket);
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!socket) return;

    const listener = (data: any) => savedCallback.current(data);

    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
  }, [event, socket]);
};
