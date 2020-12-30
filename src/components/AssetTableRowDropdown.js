import React from "react";
import { texts } from "./data/descriptions";
import TokenRequestController from "./TokenRequestController";
import TokenRequestEmbedded from "./TokenRequestEmbedded";

function AssetTableRowDropdown(props) {
  const { tokenName, connectWeb3, legacy } = props;

  return (
    <div className="main-table__dropdown">
      <table className="table table-offer">
        <tbody>
          <tr>
            <td>Investment strategy</td>
            <td>What's it like</td>
            <td>Details</td>
            <td>Risk</td>
          </tr>
          <tr>
            <td>{texts[tokenName].name}</td>
            <td>{texts[tokenName].shortDesc}</td>
            <td>{texts[tokenName].fullDesc}</td>
            <td>{texts[tokenName].benefits}</td>
          </tr>
          {!legacy ? (
            <TokenRequestController
              initialToken={tokenName}
              initialCurrency={"usdt"}
              connectWeb3={connectWeb3}
              Component={TokenRequestEmbedded}
            />
          ) : (
            ""
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTableRowDropdown;
