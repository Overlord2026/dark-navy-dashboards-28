
import React from "react";
import { motion } from "framer-motion";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface StaggeredTableProps {
  children: React.ReactNode;
  headers?: React.ReactNode;
  className?: string;
}

const tableContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const tableRowVariants = {
  hidden: { 
    opacity: 0, 
    x: -20,
    scale: 0.98,
  },
  visible: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25,
      mass: 0.8,
    },
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

export const StaggeredTable: React.FC<StaggeredTableProps> = ({ 
  children, 
  headers,
  className = "" 
}) => (
  <Table className={className}>
    {headers && (
      <motion.thead
        variants={headerVariants}
        initial="hidden"
        animate="visible"
      >
        {headers}
      </motion.thead>
    )}
    <motion.tbody
      variants={tableContainerVariants}
      initial="hidden"
      animate="visible"
    >
      {children}
    </motion.tbody>
  </Table>
);

export const StaggeredTableRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = "" 
}) => (
  <motion.tr variants={tableRowVariants} className={className}>
    {children}
  </motion.tr>
);
