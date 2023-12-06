import React, { useEffect, useState } from "react";
import { colorByIndex } from "./colors";
import { fetchWeb3Data } from "./daoes";
import { checkIsBlastDao } from "./checkIsBlastDao";

const PortfolioParts = (props) => {
  const { tokenAddress } = props;

  const [loading, setLoading] = useState(true);
  const [partList, setPartList] = useState();

  const isBlastDao = checkIsBlastDao(tokenAddress);

  useEffect(() => {
    let isCancelled = false;

    const fn = async () => {
      setLoading(true);

      const pricePercent = await fetchWeb3Data(tokenAddress);

      if (!isCancelled) {
        setLoading(false);
        console.log("isBlast", isBlastDao);
        if (isBlastDao) {
          setPartList([
            { name: "ETH", pricePercentValue: 100.0, token: "ETH" },
          ]);
        } else {
          setPartList(pricePercent);
        }
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
