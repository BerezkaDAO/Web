import React from "react";
import { tokenInfo, tokens, currencies, currencyInfo } from "./data/tokens";
import Select from "./Select";

function TokenRequestStandalone(props) {
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
  } = props;

  return (
    <div className="inner">
      <form className="form">
        <div className="form__header">
          <h2 className="title-2">New request</h2>
        </div>
        <div className="form__content">
          <div className="form__item">
            <div className="form__label">
              Requested Amount <b className="red">*</b>
            </div>
            <div className="input-select">
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
          </div>
          <div className="form__item">
            <div className="form__label">
              Offered Amount <b className="red">*</b>
            </div>
            <div className="input-select">
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
          <div className="form__button">
            <button
              className={
                "button _full _large" +
                (canPerformTokenRequest ? "" : " _disabled")
              }
              disabled={!canPerformTokenRequest}
              onClick={(e) => {
                e.preventDefault();
                performTokenRequest();
              }}
            >
              Create request
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default TokenRequestStandalone;
