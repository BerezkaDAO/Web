import React from "react";
import { tokens } from "./data/tokens";
import AssetTableRow from "./AssetTableRow";
import AssetTableHeader from "./AssetTableHeader";

function AssetTable(props) {
  const { connectWeb3 } = props;

  return (
    <div className="section _full main-table _mb">
      <AssetTableHeader />
      {tokens.map((token) => (
        <AssetTableRow
          key={token}
          tokenName={token}
          connectWeb3={connectWeb3}
        />
      ))}
    </div>
  );
}

export default AssetTable;
