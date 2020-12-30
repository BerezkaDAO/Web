import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { tokens } from "./data/tokens";
import AssetTableRow from "./AssetTableRow";
import AssetTableHeader from "./AssetTableHeader";

function AssetTable(props) {
  const { connectWeb3 } = props;

  const [open, setOpen] = useState();
  const location = useLocation();
  useEffect(() => {
    if (location.hash && location.hash.endsWith("#flex")) {
      setOpen("flex");
    }
  }, [location]);

  return (
    <div className="section _full main-table _mb">
      <AssetTableHeader />
      {tokens.map((token, index) => (
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
