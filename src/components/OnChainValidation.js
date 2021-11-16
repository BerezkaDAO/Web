import React, { useState, useEffect } from "react";
import { tokenInfo } from "./data/tokens";
import { fetchVaults } from "./widgets/daoes";

function OnChainValidation(props) {
  const { requestedToken } = props;

  const [vaults, setVaults] = useState([]);
  useEffect(() => {
    const fn = async () => {
      const fetched = await fetchVaults(tokenInfo[requestedToken].address);
      setVaults(fetched);
    };
    fn();
  }, [requestedToken]);

  return (
    <>
      <tr>
        <td colSpan={4} className="desktop_only" style={{ textAlign: "right" }}>
          {vaults.map((vault, index) => (
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
