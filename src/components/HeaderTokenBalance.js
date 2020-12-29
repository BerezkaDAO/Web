import React from "react";
import { tokenInfo } from "./data/tokens";
import TokenPrice from "./widgets/TokenPrice";

function HeaderTokenBalance(props) {
  const token = props.match.params.id;
  const tokenAddress = tokenInfo[token].address;
  return (
    <div className="balance">
      <div className="balance__amount">
        <TokenPrice
          dollarSeparator=" "
          separator=" "
          tokenAddress={tokenAddress}
        />
      </div>
    </div>
  );
}

export default HeaderTokenBalance;
