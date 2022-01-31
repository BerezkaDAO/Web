import React from "react";
import TotalPrice from "./widgets/TotalPrice";
import { tokenAddresses } from "./data/tokens";

function HeaderBalance(props) {
  const { value } = props;
  return (
    <div className="balance">
      <div className="balance__amount">
        {value || <TotalPrice tokens={tokenAddresses} />}
      </div>
    </div>
  );
}

export default HeaderBalance;
