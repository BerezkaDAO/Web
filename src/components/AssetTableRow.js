import React, { useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import AssetTableRowDropdown from "./AssetTableRowDropdown";
import { tokenInfo } from "./data/tokens";
import APY from "./widgets/APY";
import APYLegacy from "./widgets/legacy/APYLegacy";
import TokenPriceLegacy from "./widgets/legacy/TokenPriceLegacy";
import TokenPrice from "./widgets/TokenPrice";

function AssetTableRow(props) {
  const { tokenName, connectWeb3, open, onClick, legacy, web3Global } = props;

  const { address, tableName } = tokenInfo[tokenName];

  const myRef = useRef(null);
  const location = useLocation();
  useEffect(() => {
    if (
      myRef &&
      location.hash &&
      location.hash.endsWith("#flex") &&
      tokenName === "flex"
    ) {
      setTimeout(() => {
        if (myRef.current) {
          myRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
            inline: "center",
          });
        }
      }, 100);
    }
  }, [location, myRef, myRef.current]);

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
          {legacy ? (
            <TokenPriceLegacy tokenAddress={address} />
          ) : (
            <TokenPrice tokenAddress={address} />
          )}
        </div>
        <div className="main-table__td">
          {legacy ? (
            <APYLegacy tokenAddress={address} decimals={0} />
          ) : (
            <APY tokenAddress={address} decimals={0} />
          )}
        </div>
        <div className="main-table__td">
          <div className="main-table__dropdown-btn" ref={myRef} />
        </div>
      </div>
      <AssetTableRowDropdown
        legacy={legacy}
        connectWeb3={connectWeb3}
        tokenName={tokenName}
        web3Global={web3Global}
      />
    </>
  );
}

export default React.memo(AssetTableRow);
