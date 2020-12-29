import React from "react";

function HeaderAccountBalance(props) {
  const { globalTotal } = props;
  return (
    <div className="balance">
      <div className="balance__amount">
        ${" "}
        {globalTotal
          .toFixed(0)
          .toString()
          .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
      </div>
    </div>
  );
}

export default HeaderAccountBalance;
