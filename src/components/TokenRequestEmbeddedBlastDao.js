import React, { useState } from "react";
import { currencyInfo } from "./data/tokens";
import { exchanges, tokenExchanges } from "./data/exchanges";
import Select from "./Select";

function Deposit(props) {
  const { canPerformTokenRequest, performTokenRequest } = props;

  const handleClick = () => {
    if (canPerformTokenRequest) {
      performTokenRequest();
    }
  };

  return (
    <td className="mobile_no_border">
      <a
        className={
          "button _full" + (canPerformTokenRequest ? "" : " _disabled")
        }
        href
        onClick={handleClick}
      >
        Deposit
      </a>
    </td>
  );
}

const eth = {
  symbol: "ETH",
  address: "0xa3a26A34483D325075bE577Bd2DF2A73bc94DC8A",
  decimals: 18,
  image: "type2",
};

export function TokenRequestEmbeddedBlastDao(props) {
  const {
    setOfferedToken,
    offeredToken,
    offeredAmount,
    requestedToken,
    performTokenRequest,
    canPerformTokenRequest,
    errorMessage,
    smallSum,
    performBlastDeposit,
    setOfferedAmountBlastDao,
  } = props;

  const parseInputValue = (value) => {
    const parsed = value
      .replace(",", ".")
      .replace(/[^\d.]/g, "") // rm non didgit and non . symbols
      .replace(/^0+/, "0"); // rm repatative 0 in the beginning

    if (Number(parsed).toFixed(5) === parsed) {
    } else {
      setOfferedAmountBlastDao(parsed);
    }
  };

  return (
    <>
      <tr>
        <td />
        <td />
        <td colSpan={2} style={{ borderBottom: "none" }}>
          <div
            className="table-offer__group"
            style={{
              display: "flex",
              justifyContent: "flex-end",
              width: "100%",
            }}
          >
            <div className="table-offer__label">Offered Amount</div>
            <div className="input-select _light flex-grow">
              <input
                className="input"
                type="text"
                required
                value={offeredAmount}
                onChange={(e) => parseInputValue(e.target.value)}
              />
              <Select
                value={offeredToken}
                setValue={setOfferedToken}
                options={["eth"]}
                valueDisplay={(currency) => eth.symbol}
                valueImage={(currency) => eth.image}
              />
            </div>
          </div>
        </td>
      </tr>
      {!smallSum && errorMessage && (
        <tr>
          <td
            colSpan={4}
            className="error"
            style={{ borderBottomWidth: 0, padding: 0 }}
          >
            <span>{errorMessage}</span>
          </td>
        </tr>
      )}
      {smallSum && (
        <tr>
          <td colSpan={2} style={{ borderBottomWidth: 0 }} />
          <td
            colSpan={2}
            className="redirect"
            style={{ borderBottomWidth: 0, padding: 0, textAlign: "left" }}
          >
            <span className="redirect">
              Dear user,{" "}
              <span className="redirect_error">
                Token Request works for amounts over $3,000 USDT / USDC / DAI
              </span>
              <br />
              For smaller amounts kindly proceed to Uniswap, Sushiswap or 1Inch
            </span>
          </td>
        </tr>
      )}
      {!smallSum && (
        <tr>
          <td colSpan={2} />
          <td />
          <Deposit
            canPerformTokenRequest={canPerformTokenRequest}
            performTokenRequest={performBlastDeposit}
          />{" "}
        </tr>
      )}
      {smallSum && (
        <tr>
          <td colSpan={2} />
          <td colSpan={2}>
            <div className="buttons_container">
              {Object.keys(exchanges)
                .filter(
                  (exchange) =>
                    tokenExchanges[requestedToken] &&
                    tokenExchanges[requestedToken][exchange]
                )
                .map((exchange) => (
                  <a
                    target="_blank"
                    key={exchange}
                    className={
                      "button _medium" +
                      (canPerformTokenRequest ? "" : " _disabled")
                    }
                    href={tokenExchanges[requestedToken][exchange] || "#"}
                    onClick={performTokenRequest}
                  >
                    Buy on {exchanges[exchange]}
                  </a>
                ))}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
