import React, { useEffect, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { checkIsBlastDao } from "./checkIsBlastDao";
import { sumBlastData } from "./ExternalBlastDao";

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
      await googleDoc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_GOOGLE_EMAIL,
        private_key: process.env.REACT_APP_GOOGLE_KEY.replace(/\\n/g, "\n"),
      });
      await googleDoc.loadInfo();

      const sheet = googleDoc.sheetsByIndex[0];
      const rows = await sheet.getRows();
      setData(rows);
      setIsLoading(false);
    } catch (e) {
      console.log("google-spreadsheet fetch error", e);
    }
  };

  const currentAccountData =
    data.filter(
      (account) => account.from?.toLowerCase() === address?.toLowerCase()
    ) ||
    data[0] ||
    [];

  const blastCurrent = sumBlastData(currentAccountData);

  const blastTotal = sumBlastData(data);

  return { blastTotal, blastCurrent, isLoading };
};
