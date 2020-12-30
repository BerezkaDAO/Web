import React, { useState } from "react";
import { tokens } from "./data/tokens";
import AssetTableRow from "./AssetTableRow";
import AssetTableHeader from "./AssetTableHeader";

function AssetTable(props) {
  const { connectWeb3 } = props;

  const [open, setOpen] = useState();

  return (
    <div className="section _full main-table _mb">
      <AssetTableHeader />
      {tokens.map((token) => (
        <AssetTableRow
          open={open === token}
          onClick={() => {
            if (open === token) {
              setOpen(null);
            } else {
              setOpen(token);
            }
          }}
          key={token}
          tokenName={token}
          connectWeb3={connectWeb3}
        />
      ))}
    </div>
  );
}

export default AssetTable;
