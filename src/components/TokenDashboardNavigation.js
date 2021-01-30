import React from "react";
import { NavLink } from "react-router-dom";
import { dashboardTokens, tokenInfo } from "./data/tokens";

function TokenDashboardNavigation() {
  return (
    <div className="breadcrumbs">
      {dashboardTokens.map((token) => (
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
                margin: "2px 10px",
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
