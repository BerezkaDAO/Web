import React from "react";
import { colorByIndex } from "./colors";

export const PortfolioPartsBlastDao = ({ blastLiquidity, isLoading }) => {
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <ul className="status-list">
      {Object.entries(blastLiquidity).map(([name, percent], index) => (
        <li
          key={index}
          className="status-list__item"
          style={{
            color: colorByIndex(index),
          }}
        >
          {name.toUpperCase()}: {percent.toFixed(2)} %
        </li>
      ))}
    </ul>
  );
};
