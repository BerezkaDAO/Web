import React from "react";
import { tokenInfo, currencies, currencyInfo } from "./data/tokens";
import Select from "./Select";

function TokenRequestEmbedded(props) {
  const {
    setRequestedToken,
    setOfferedToken,
    setRequestedAmount,
    setOfferedAmount,
    offeredToken,
    requestedAmount,
    offeredAmount,
    requestedToken,
    performTokenRequest,
    canPerformTokenRequest,
    errorMessage,
  } = props;

  return (
    <>
      <tr className="desktop_only">
        <td>Token request</td>
        <td />
        <td />
        <td />
      </tr>
      <tr className="desktop_only">
        <td className="_right" style={{ borderBottom: "none" }}>
          <div className="table-offer__label">Requested Amount</div>
        </td>
        <td style={{ borderBottom: "none" }}>
          <div className="input-select _light">
            <input
              className="input"
              type="text"
              required
              value={requestedAmount}
              onChange={(e) =>
                setRequestedAmount(Number.parseFloat(e.target.value))
              }
            />
            <Select
              value={requestedToken}
              setValue={setRequestedToken}
              options={[requestedToken]}
              valueDisplay={(token) => tokenInfo[token].symbol}
              valueImage={(_) => "logo"}
            />
          </div>
        </td>
        <td colSpan={2} style={{ borderBottom: "none" }}>
          <div className="table-offer__group">
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
      {errorMessage && (
        <tr className="desktop_only">
          <td
            colSpan={4}
            className="error"
            style={{ borderBottomWidth: 0, padding: 0 }}
          >
            <span>{errorMessage && errorMessage.toUpperCase()}</span>
          </td>
        </tr>
      )}
      <tr>
        <td />
        <td colSpan={2} className="onchain desktop_only">
          {tokenInfo[requestedToken].vaults.map((vault, index) => (
            <a
              target="_blank"
              key={index}
              href={`https://app.zerion.io/${vault}/overview`}
              className="button _medium"
              style={{ marginLeft: "15px" }}
            >
              Onchain Validation
              {tokenInfo[requestedToken].vaults.length === 1
                ? ""
                : `-${index + 1}`}
            </a>
          ))}
        </td>
        <td className="desktop_only">
          <a
            className={
              "button _full" + (canPerformTokenRequest ? "" : " _disabled")
            }
            href
            onClick={performTokenRequest}
          >
            Create request
          </a>
        </td>
      </tr>
    </>
  );
}

export default TokenRequestEmbedded;
