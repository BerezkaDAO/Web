import { GoogleSpreadsheet } from "google-spreadsheet";

const googleFileId = process.env.REACT_APP_GOOGLE_SHEETS_ID;

const parseStringNumber = (string) => {
  return parseFloat(string.replace(/,/g, ".").replace(/\s/g, ""));
};

export const calculateLiquidity = (googleSheet) => {
  const balances = googleSheet.reduce(
    (acc, account) => {
      const balance = parseStringNumber(account["value _usd_on_day_of_txn"]);
      if (account.Value === "USDT") {
        acc.usdt += balance;
      } else if (account.Value === "ETH") {
        acc.eth += balance;
      }

      acc.total += balance;
      return acc;
    },
    { eth: 0, usdt: 0, total: 0 }
  );
  const ethLiquidity = (balances.eth / balances.total) * 100;
  const usdLiquidity = (balances.usdt / balances.total) * 100;
  return { eth: ethLiquidity, usdt: usdLiquidity };
};

export const sumBlastData = (googleSheet) => {
  try {
    return googleSheet.reduce(
      (acc, account) => {
        acc.eth = acc.eth + parseStringNumber(account.value_eth);
        acc.usd =
          acc.usd + parseStringNumber(account["value _usd_on_day_of_txn"]);
        acc.points = acc.points + parseStringNumber(account["points_user"]);

        return acc;
      },
      { eth: 0, usd: 0, points: 0 }
    );
  } catch (e) {
    console.log("GoogleSheet Data, calculate blast sum", e);
  }
};

export const getBlastPointPrice = (googleSheet) => {
  try {
    return googleSheet[0]
      ? parseStringNumber(googleSheet[0]["Token_Price"])
      : 0;
  } catch (e) {
    console.log("GoogleSheet Data, getting blast price", e);
  }
};

const connectGoogleDoc = (function () {
  const googleDoc = new GoogleSpreadsheet(googleFileId);
  let isConnected = false;
  return async () => {
    if (!isConnected) {
      await googleDoc.useServiceAccountAuth({
        client_email: process.env.REACT_APP_GOOGLE_EMAIL,
        private_key: process.env.REACT_APP_GOOGLE_KEY.replace(/\\n/g, "\n"),
      });
      await googleDoc.loadInfo();
    }
    return googleDoc;
  };
})();

export const fetchBlastAccounts = async () => {
  try {
    const doc = await connectGoogleDoc();
    const sheet = doc.sheetsByIndex[0];
    const data = await sheet.getRows();
    return data;
  } catch (e) {
    console.log("google-spreadsheet fetchBlastAccounts error", e);
    return [];
  }
};

export const fetchBlastSourcegraph = async () => {
  try {
    const doc = await connectGoogleDoc();

    const sheet = doc.sheetsById[266250613];
    const data = await sheet.getRows();
    const chartData = data.map((dayData) => {
      const dateParts = dayData.Date.split("/");
      const isoDate = `${dateParts[1]}-${dateParts[0]}-${dateParts[2]}`;
      return [
        new Date(isoDate).getTime(),
        parseStringNumber(dayData.Porfolio_Value_USD),
      ];
    });

    return chartData;
  } catch (e) {
    console.log("google-spreadsheet fetchBlastSourcegraph fetch error", e);
    return [];
  }
};
