import React, { useEffect, useState } from "react";
import { colorByIndex } from "./colors";
import { fetchWeb3Data } from "./fetchWeb3";

const PortfolioParts = (props) => {
  const { tokenAddress, web3 } = props;

  const [loading, setLoading] = useState(true);
  const [partList, setPartList] = useState();

  useEffect(() => {
    let isCancelled = false;

    const fn = async () => {
      setLoading(true);
      if (!web3) {
        return;
      }

      const pricePercent = await fetchWeb3Data(web3, tokenAddress);

      if (!isCancelled) {
        setLoading(false);
        setPartList(pricePercent);
      }
    };
    fn();

    return () => {
      isCancelled = true;
    };
  }, [tokenAddress, web3]);

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
