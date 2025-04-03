
import React from "react";

export const GroupListHeader: React.FC = () => {
  return (
    <div className="grid grid-cols-12 gap-2 p-3 bg-muted/50 text-sm font-medium">
      <div className="col-span-5">GROUP NAME</div>
      <div className="col-span-3 text-center">MEMBERS</div>
      <div className="col-span-2 text-center">PORTFOLIOS</div>
      <div className="col-span-2 text-right">ACTIONS</div>
    </div>
  );
};
