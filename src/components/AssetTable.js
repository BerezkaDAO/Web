import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { fetchTokens } from "./widgets/daoes";
import { defaultToken } from "./data/tokens";
import AssetTableRow from "./AssetTableRow";
import AssetTableHeader from "./AssetTableHeader";

function AssetTable(props) {
  const { connectWeb3, web3Global } = props;

  const [open, setOpen] = useState();
  const [tokens, setTokens] = useState([]);
  const location = useLocation();
  useEffect(() => {
    if (location.hash && location.hash.endsWith(`#${defaultToken[0]}`)) {
      setOpen(defaultToken[0]);
    }
  }, [location]);

  useEffect(() => {
    let isCancelled = false;
    const fn = async () => {
      const daoTokens = await fetchTokens();
      if (!isCancelled) {
        setTokens(daoTokens);
      }
    };
    fn();

    return () => {
      isCancelled = true;
    };
  }, []);

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
          web3Global={web3Global}
        />
      ))}
    </div>
  );
}

export default AssetTable;
