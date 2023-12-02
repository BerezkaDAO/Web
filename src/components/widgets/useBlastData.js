import React, { useEffect, useState } from "react";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { checkIsBlastDao } from "./checkIsBlastDao";

const googleFileId = process.env.REACT_APP_GOOGLE_SHEETS_ID;

const googleDoc = new GoogleSpreadsheet(googleFileId);

const parseStringNumber = (string) => {
  return parseFloat(string.replace(/,/g, ".").replace(/\s/g, ""));
};

const sumBlastData = (googleSheet) => {
  try {
    return googleSheet.reduce(
      (acc, account) => {
        acc.eth = acc.eth + parseStringNumber(account.value_eth);
        acc.usd = acc.usd + parseStringNumber(account["value _usd"]);
        acc.points = acc.points + parseStringNumber(account["points-user"]);

        return acc;
      },
      { eth: 0, usd: 0, points: 0 }
    );
  } catch (e) {
    console.log("Convert google sheet data", e);
  }
};

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
    data.filter((account) => account.from === address) || data[0] || [];

  const blastCurrent = sumBlastData(currentAccountData);

  const blastTotal = sumBlastData(data);

  return { blastTotal, blastCurrent, isLoading };
};
