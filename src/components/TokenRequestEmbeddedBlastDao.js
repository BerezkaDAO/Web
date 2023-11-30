import React from "react";
import { tokenInfo, currencies, currencyInfo } from "./data/tokens";
import { exchanges, tokenExchanges } from "./data/exchanges";
import Select from "./Select";

function Deposit(props) {
  const { canPerformTokenRequest, performTokenRequest } = props;
  return (
    <td className="mobile_no_border">
      <a
        className={
          "button _full" + (canPerformTokenRequest ? "" : " _disabled")
        }
        href
        onClick={performTokenRequest}
      >
        Deposit
      </a>
    </td>
  );
}

function Withdraw(props) {
  const { withdrawEnabled, canPerformTokenWithdraw, performTokenWithdraw } =
    props;
  return (
    <>
      {withdrawEnabled ? (
        <td className="mobile_no_border">
          <a
            className={
              "button _full" + (canPerformTokenWithdraw ? "" : " _disabled")
            }
            href
            onClick={performTokenWithdraw}
          >
            Withdraw
          </a>
        </td>
      ) : (
        <td />
      )}
    </>
  );
}

export function TokenRequestEmbeddedBlastDao(props) {
  const {
    setOfferedToken,
    setOfferedAmount,
    offeredToken,
    offeredAmount,
    requestedToken,
    performTokenRequest,
    canPerformTokenRequest,
    performTokenWithdraw,
    canPerformTokenWithdraw,
    errorMessage,
    withdrawEnabled,
    smallSum,
  } = props;

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
                onChange={(e) =>
                  setOfferedAmount(Number.parseFloat(e.target.value))
                }
              />
              <Select
                value={offeredToken}
                setValue={setOfferedToken}
                options={currencies}
                valueDisplay={(currency) => currencyInfo[currency].symbol}
                valueImage={(currency) => currencyInfo[currency].image}
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
          {withdrawEnabled ? (
            <>
              <Deposit
                canPerformTokenRequest={canPerformTokenRequest}
                performTokenRequest={performTokenRequest}
              />
              <Withdraw
                withdrawEnabled={withdrawEnabled}
                canPerformTokenWithdraw={canPerformTokenWithdraw}
                performTokenWithdraw={performTokenWithdraw}
              />
            </>
          ) : (
            <>
              <td />
              <Deposit
                canPerformTokenRequest={canPerformTokenRequest}
                performTokenRequest={performTokenRequest}
              />{" "}
            </>
          )}
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
