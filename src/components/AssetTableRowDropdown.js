import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import OnChainValidation from "./OnChainValidation";
import TokenRequestController from "./TokenRequestController";
import TokenRequestEmbedded from "./TokenRequestEmbedded";
import { checkIsBlastDao } from "./widgets/checkIsBlastDao";
import { TokenRequestEmbeddedBlastDao } from "./TokenRequestEmbeddedBlastDao";

function AssetTableRowDropdown(props) {
  const { dao, connectWeb3, legacy, web3Global } = props;
  const isBlastDao = checkIsBlastDao(dao?.id);

  if (!dao) {
    return <></>;
  }

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
            <td>{parse("" + dao.display_name)}</td>
            <td>
              {parse("" + dao.display_short_description)}
              <div className="main-table__hint">
                For additional information about the strategy{" "}
                <a
                  className="main-table__hint-link"
                  href="https://t.me/ask100500"
                  target={"_blank"}
                >
                  Contact us
                </a>
              </div>
            </td>
            <td>{parse("" + dao.display_full_description)}</td>
            <td>{parse("" + dao.display_benefits)}</td>
          </tr>
          {!legacy ? (
            <TokenRequestController
              dao={dao}
              initialCurrency={"usdt"}
              connectWeb3={connectWeb3}
              web3Global={web3Global}
              Component={
                isBlastDao ? TokenRequestEmbeddedBlastDao : TokenRequestEmbedded
              }
            />
          ) : (
            <OnChainValidation requestedToken={dao.id} />
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTableRowDropdown;
