import React from "react";
import { tokenInfo, tokens, currencies, currencyInfo } from "./data/tokens";
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
      <tr>
        <td>Token request</td>
        <td />
        <td />
        <td />
      </tr>
      <tr>
        <td className="_right">
          <div className="table-offer__label">Requested Amount</div>
        </td>
        <td>
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
              options={tokens}
              valueDisplay={(token) => tokenInfo[token].symbol}
              valueImage={(_) => "logo"}
            />
          </div>
        </td>
        <td colSpan={2}>
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
      <tr>
        <td colSpan={3} className="error">
          <span>{errorMessage}</span>
        </td>
        <td>
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
