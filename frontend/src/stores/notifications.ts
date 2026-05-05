import { nanoid } from "nanoid";
import { create } from "zustand";

export type Notification = {
  id: string;
  type: "info" | "warning" | "success" | "error";
  title: string;
  message?: string;
  show: boolean;
};

type NotificationsStore = {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id" | "show">) => void;
  dismissNotification: (id: string) => void;
};

export const useNotificationStore = create<NotificationsStore>((set) => ({
  notifications: [
    {
      id: "1",
      type: "info",
      title: "Good title",
      message: "Good message",
      show: false,
    },
  ],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { id: nanoid(), ...notification, show: true },
      ],
    })),
  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.map((notification) => {
        if (notification.id === id) {
          // notification.show = false;
        }
        return notification;
      }),
    })),
}));
