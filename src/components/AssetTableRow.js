import React from "react";

import AssetTableRowDropdown from "./AssetTableRowDropdown";
import { tokenInfo } from "./data/tokens";
import APY from "./widgets/APY";
import TokenPrice from "./widgets/TokenPrice";

function AssetTableRow(props) {
  const { tokenName, connectWeb3, open, onClick } = props;

  const { address, tableName } = tokenInfo[tokenName];

  return (
    <>
      <div
        className={"main-table__tr activeToggle" + (open ? " active" : "")}
        onClick={onClick}
      >
        <div className="main-table__td">
          <div className="main-table__td-row">
            <img className="main-table__icon" src="img/logo.png" alt="" />
            <span>{tableName}</span>
          </div>
        </div>
        <div className="main-table__td">
          <TokenPrice tokenAddress={address} />
        </div>
        <div className="main-table__td">
          <APY tokenAddress={address} decimals={0} />
        </div>
        <div className="main-table__td">
          <div className="main-table__dropdown-btn" />
        </div>
      </div>
      <AssetTableRowDropdown connectWeb3={connectWeb3} tokenName={tokenName} />
    </>
  );
}

export default React.memo(AssetTableRow);
