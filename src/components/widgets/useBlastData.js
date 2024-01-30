import React, { useEffect, useMemo, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { checkIsBlastDao } from "./checkIsBlastDao";
import {
  sumBlastData,
  calculateLiquidity,
  fetchBlastAccounts,
  getBlastPointPrice,
} from "./ExternalBlastDao";

const googleFileId = process.env.REACT_APP_GOOGLE_SHEETS_ID;

const googleDoc = new GoogleSpreadsheet(googleFileId);

export const useBlastData = (address, token) => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isBlastDao = checkIsBlastDao(token);
  useEffect(() => {
    if (isBlastDao) {
      fetchSpreadSheet();
    }
  }, []);

  const fetchSpreadSheet = async () => {
    try {
      setIsLoading(true);
      const rows = await fetchBlastAccounts();
      setData(rows);
      setIsLoading(false);
    } catch (e) {
      console.log("useBlastData error", e);
    }
  };

  const currentAccountData =
    data.filter(
      (account) => account.from?.toLowerCase() === address?.toLowerCase()
    ) ||
    data[0] ||
    [];

  const { blastTotal, blastCurrent, blastLiquidity, blastPrice } =
    useMemo(() => {
      const blastCurrent = sumBlastData(currentAccountData);

      const blastTotal = sumBlastData(data);

      const blastLiquidity = calculateLiquidity(data);

      const blastPrice = getBlastPointPrice(data);

      return { blastTotal, blastCurrent, blastLiquidity, blastPrice };
    }, [data]);

  return { blastTotal, blastCurrent, isLoading, blastLiquidity, blastPrice };
};
