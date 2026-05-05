import "./notification.css";
import { motion, AnimatePresence } from "framer-motion";

const icons = {
  info: <i className="fa-solid fa-circle-info text-blue"></i>,
  success: <i className="fa-regular fa-circle-check text-success"></i>,
  warning: <i className="fa-solid fa-circle-exclamation text-warning"></i>,
  error: <i className="fa-regular fa-circle-xmark text-danger"></i>,
};

export type NotificationProps = {
  notification: {
    id: string;
    type: keyof typeof icons;
    title: string;
    message?: string;
    show: boolean;
  };
  onDismiss: (id: string) => void;
};

export const Notification = ({
  notification: { id, type, title, message, show },
  onDismiss,
}: NotificationProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: 500 }}
          animate={{ x: 0 }}
          exit={{ x: 500 }}
          transition={{ type: "spring", damping: 10, stiffness: 70 }}
          className="alert alert-light shadow-lg rounded-lg w-35"
          role="alert"
          onClick={() => onDismiss(id)}
        >
          <h6 className="alert-heading not-icon">
            {icons[type]} <span className="ps-2"> {title}</span>
          </h6>
          <p className="not-msg">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
