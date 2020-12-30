import React from "react";
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
            <td>Berezka Flex</td>
            <td>
              Imagine that you own an exchange and earn commission from each
              trade
            </td>
            <td>
              Stable coins are allocated across
              <br />
              decentralized exchanges
              <br />
              (Uniswap, dydx, etc.) and are split in trading pairs (ETH/USDC,
              USDC/Dai, etc). Each exchange charges a commission on each trade
              in such pairs and shares the commission with you. Flex strategy
              may include other investment instruments which are introduced
              after DAO voting
            </td>
            <td>
              - instant withdrawal
              <br />- limited exposure to volatile assets (e.g. ETH, if selected
              in traded pair), smoothed by earned trading commissions
              <br />- higher returns with longer investment periods
            </td>
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
