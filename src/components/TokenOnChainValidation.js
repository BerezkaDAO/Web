import React, { useState, useEffect } from "react";
import { tokenInfo } from "./data/tokens";
import { fetchVaults } from "./widgets/daoes";

function TokenOnChainValidation(props) {
  const token = props.token;

  const [vaults, setVaults] = useState([]);
  useEffect(() => {
    const fn = async () => {
      const fetched = await fetchVaults(tokenInfo[token].address);
      setVaults(fetched);
    };
    fn();
  }, [token]);

  return (
    <>
      <div className="validation">
        <span className="validation__caption desktop_only">
          ONCHAIN VALIDATION:
        </span>

        {vaults.map((vault, index) => (
          <a
            target="_blank"
            key={index}
            className="validation__item"
            href={`https://zapper.fi/account/${vault}`}
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
