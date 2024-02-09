import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { getAvailableDaos } from "./widgets/daoes";
import { tokenInfo } from "./data/tokens";

function TokenDashboardNavigation() {
  const [daoIds, setDaoIds] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    const fn = async () => {
      const daoIds = await getAvailableDaos();
      if (!isCancelled) {
        setDaoIds(daoIds);
      }
    };
    fn();

    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div className="breadcrumbs">
      {daoIds.map((token) => (
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
