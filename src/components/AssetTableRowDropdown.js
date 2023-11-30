import React, { useState, useEffect } from "react";
import parse from "html-react-parser";
import { fetchDaoByName } from "./widgets/daoes";
import OnChainValidation from "./OnChainValidation";
import TokenRequestController from "./TokenRequestController";
import TokenRequestEmbedded from "./TokenRequestEmbedded";
import { checkIsBlastDao } from "./widgets/checkIsBlastDao";
import { TokenRequestEmbeddedBlastDao } from "./TokenRequestEmbeddedBlastDao";

function AssetTableRowDropdown(props) {
  const { tokenName, connectWeb3, legacy, web3Global } = props;
  const [dao, setDao] = useState();
  const isBlastDao = checkIsBlastDao(dao);
  useEffect(() => {
    const fn = async () => {
      const result = await fetchDaoByName(tokenName);
      setDao(result);
    };
    fn();
  }, [tokenName]);

  if (!dao) {
    return <></>;
  }

  // console.log(dao, tokenName, legacy);

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
            <td>{parse("" + dao.display_short_description)}</td>
            <td>{parse("" + dao.display_full_description)}</td>
            <td>{parse("" + dao.display_benefits)}</td>
          </tr>
          {!legacy ? (
            <TokenRequestController
              initialToken={tokenName}
              initialCurrency={"usdt"}
              connectWeb3={connectWeb3}
              web3Global={web3Global}
              Component={
                isBlastDao ? TokenRequestEmbeddedBlastDao : TokenRequestEmbedded
              }
            />
          ) : (
            <OnChainValidation requestedToken={tokenName} />
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AssetTableRowDropdown;
