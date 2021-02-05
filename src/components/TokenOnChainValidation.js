import React from "react";
import { tokenInfo } from "./data/tokens";

function TokenOnChainValidation(props) {
  const token = props.token;
  const vaults = tokenInfo[token].vaults;

  return (
    <>
      <div className="validation">
        <span className="validation__caption desktop_only">
          ONCHAIN VALIDATION:
        </span>

        {vaults &&
          vaults.map((vault, index) => (
            <a
              target="_blank"
              key={index}
              className="validation__item"
              href={`https://debank.com/profile/${vault}`}
              style={{ zIndex: 2 }}
            >
              <div style={{ display: "flex" }}>
                <span class="validation__button">
                  WALLET{vaults.length > 1 ? ` ${index + 1}` : ""}
                </span>
                {index !== vaults.length - 1 && (
                  <div className="validation__separator" />
                )}
              </div>
            </a>
          ))}
      </div>
    </>
  );
}

export default TokenOnChainValidation;
