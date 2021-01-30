import React, { useState, useEffect } from "react";
import { mergeByDayID } from "./merger";
import { round } from "./round";
import { fetchCommon } from "./fetchCommon";
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
  const { tokenAddress, isLegacy } = props;

  const { loading, data } = useQuery(GET_LAST_PRICE, {
    variables: {
      tokenAddress,
    },
    skip: isLegacy,
  });

  const [historicalData, setHistoricalData] = useState();

  useEffect(() => {
    const fn = async () => {
      const historicalData = await fetchCommon(tokenAddress, 3);
      setHistoricalData(historicalData);
    };
    fn();
  }, [tokenAddress]);

  if (loading || !historicalData) {
    return <>Loading...</>;
  }

  const merged = mergeByDayID(
    historicalData,
    data ? data.dayHistoricalDatas : []
  );

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
        color: "#008cb9",
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
