import { type Socket, io } from "socket.io-client";
import { create } from "zustand";
import { authClient } from "../auth-client";

interface State {
  socket: Socket | null;
  isOnline: boolean;
  initSocket: (competitionId: string) => void;
  disconnectSocket: () => void;
}

export const useSocketStore = create<State>((set, get) => ({
  socket: null,
  isOnline: false,
  initSocket: async (competitionId: string) => {
    if (get().socket) return;

    const { data, error } = await authClient.getSession();
    if (error || !data || !competitionId) return;

    const server = import.meta.env.VITE_SERVER || "http://localhost:3000";
    const url = `${server}/competition-time`;

    const socket = io(url, {
      withCredentials: true,
      auth: {
        token: data.session.token,
        competitionId,
      },
    });

    set({ socket, isOnline: true });

    socket.on("connect", () => set({ isOnline: true }));
    socket.on("disconnect", () => set({ isOnline: false }));
    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      get().disconnectSocket();
    });

    socket.connect();

    set({ socket });
  },
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.removeAllListeners();
      socket.disconnect();
      set({ socket: null, isOnline: false });
    }
  },
}));
