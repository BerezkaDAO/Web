import React, { useEffect, useState } from "react";
import { colorByIndex } from "./colors";
import { fetchWeb3Data } from "./daoes";

const PortfolioParts = (props) => {
  const { tokenAddress } = props;

  const [loading, setLoading] = useState(true);
  const [partList, setPartList] = useState();

  useEffect(() => {
    let isCancelled = false;

    const fn = async () => {
      setLoading(true);

      const pricePercent = await fetchWeb3Data(tokenAddress);

      if (!isCancelled) {
        setLoading(false);
        setPartList(pricePercent);
      }
    };
    fn();

    return () => {
      isCancelled = true;
    };
  }, [tokenAddress]);

  if (!partList || loading) {
    return <p>Loading...</p>;
  }

  return (
    <ul className="status-list">
      {partList.map((item, index) => (
        <li
          key={index}
          className="status-list__item"
          style={{
            color: colorByIndex(index),
          }}
        >
          {item.name}: {item.pricePercentValue.toFixed(2)} %
        </li>
      ))}
    </ul>
  );
};

export default PortfolioParts;
