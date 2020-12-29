import React from "react";
import { NavLink } from "react-router-dom";
import { tokens, tokenInfo } from "./data/tokens";

function TokenDashboardNavigation() {
  return (
    <div className="breadcrumbs">
      {tokens.map((token) => (
        <NavLink
          key={token}
          className="breadcrumbs__item"
          to={`/dashboard/${token}`}
        >
          <div style={{ display: "flex" }}>
            <span>{tokenInfo[token].fullName || tokenInfo[token].name}</span>
            <div
              style={{
                width: "1px",
                height: "16px",
                margin: "5px 10px",
                backgroundColor: "white",
              }}
            />
          </div>
        </NavLink>
      ))}
    </div>
  );
}

export default TokenDashboardNavigation;
