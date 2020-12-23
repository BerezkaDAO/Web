import React from "react";
import TotalPrice from "./widgets/TotalPrice";

function HeaderBalance(props) {
  return (
    <div className="balance">
      <div className="balance__amount">
        <TotalPrice />
      </div>
    </div>
  );
}

export default HeaderBalance;
