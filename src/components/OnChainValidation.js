import React from "react";
import { tokenInfo } from "./data/tokens";

function OnChainValidation(props) {
  const { requestedToken } = props;

  return (
    <>
      <tr>
        <td colSpan={4} className="desktop_only" style={{ textAlign: "right" }}>
          {tokenInfo[requestedToken].vaults &&
            tokenInfo[requestedToken].vaults.map((vault, index) => (
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
      </tr>
    </>
  );
}

export default OnChainValidation;
