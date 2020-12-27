import React, { useState, useEffect } from "react";
import { apiNameByAddress } from "../data/tokens";
import { mergeByDayID } from "./merger";
import { round } from "./round";
import { useQuery, gql } from "@apollo/react-hooks";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const GET_LAST_PRICE = gql`
  query Get($tokenAddress: String) {
    dayHistoricalDatas(
      orderBy: dayId
      orderDirection: desc
      where: { token: $tokenAddress }
    ) {
      id
      date
      dayId
      price
      token
      totalPrice
    }
  }
`;

const TokenAmountGraph = (props) => {
  const { tokenAddress } = props;

  const { loading, data } = useQuery(GET_LAST_PRICE, {
    variables: {
      tokenAddress,
    },
  });

  const [historicalData, setHistoricalData] = useState();

  useEffect(() => {
    const fn = async () => {
      if (!tokenAddress) {
        setHistoricalData(null);
      } else {
        const apiName = apiNameByAddress(tokenAddress);
        if (!apiName) {
          setHistoricalData([]);
        } else {
          const response = await fetch(
            `/storage/charts/${apiNameByAddress(tokenAddress)}/common.json`
          ).then((res) => res.json());
          const adjusted = response.map((data) => {
            return {
              date: Math.floor(data[0] / 1000),
              dayId: Math.floor(data[0] / 1000 / 86400),
              price: round(data[1] * 10 ** 6, 3),
              token: tokenAddress.toLowerCase(),
              totalPrice: round(
                Number.parseFloat(data[3]) * 10 ** 6 * 10 ** 18,
                3
              ),
            };
          });
          setHistoricalData(adjusted);
        }
      }
    };
    fn();
  }, [tokenAddress]);

  if (loading || !historicalData) {
    return <>Loading...</>;
  }

  const merged = mergeByDayID(historicalData, data.dayHistoricalDatas);

  const chartData = merged
    .map((it) => {
      return [
        Number.parseInt(it.date) * 1000,
        round(Number.parseFloat(it.totalPrice / 10 ** 18 / 10 ** 6), 3),
      ];
    })
    .reverse();

  const titleOptions = {
    // text: title
    text: null,
  };

  const config = {
    exporting: {
      enabled: false,
    },
    navigator: {
      enabled: false,
    },
    xAxis: {
      events: {
        setExtremes(event) {
          //renderIncrease({
          //    event,
          //    chart,
          //    data: chartData
          //});
        },
      },
    },
    title: titleOptions,
    subtitle: {
      text: "",
    },
    rangeSelector: {
      buttons: [
        {
          type: "hour",
          count: 1,
          text: "1h",
        },
        {
          type: "day",
          count: 1,
          text: "1d",
        },
        {
          type: "week",
          count: 1,
          text: "1w",
        },
        {
          type: "month",
          count: 1,
          text: "1m",
        },
        {
          type: "all",
          count: 1,
          text: "All",
        },
      ],
      selected: 4,
      inputEnabled: true,
    },
    yAxis: {
      title: {
        text: "Price, USD",
      },
      opposite: false,
    },

    series: [
      {
        color: "#623a6c",
        name: "Portfolio Value",
        data: chartData,
      },
    ],
  };

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={config}
        immutable={true}
      />
    </>
  );
};

export default TokenAmountGraph;
