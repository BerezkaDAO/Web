import React from "react";
import AssetTableRow from "./AssetTableRow";
import AssetTableHeader from "./AssetTableHeader";

function AssetTable(props) {
  const { connectWeb3 } = props;

  return (
    <div className="section _full main-table _mb">
      <AssetTableHeader />
      <AssetTableRow tokenName="deposit" connectWeb3={connectWeb3} />
      <AssetTableRow tokenName="flex" connectWeb3={connectWeb3} />
      <AssetTableRow tokenName="dyna" connectWeb3={connectWeb3} />
      <AssetTableRow tokenName="emiflex" connectWeb3={connectWeb3} />
    </div>
  );
}

export default AssetTable;
