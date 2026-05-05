import React from "react";
import { Head } from "../Head";
import { AnimatePresence, motion } from "framer-motion";

const ContentWrapper = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 1000 }}
        className="p-4"
      >
        <Head title={title} />
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default ContentWrapper;
