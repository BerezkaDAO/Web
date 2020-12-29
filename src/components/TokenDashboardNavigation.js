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
          {tokenInfo[token].fullName || tokenInfo[token].name}
        </NavLink>
      ))}
    </div>
  );
}

export default TokenDashboardNavigation;
