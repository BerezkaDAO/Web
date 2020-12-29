import React, { useState, useEffect, useRef } from "react";
import { apiNameByAddress } from "../data/tokens";
import { mergeByDayID } from "./merger";
import { useQuery, gql } from "@apollo/react-hooks";
import { round } from "./round";
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

const renderIncrease = (options) => {
  const { event, chart, data } = options;
  let filteredData = data;
  if (event) {
    const { max, min } = event;
    filteredData = data.filter((point) => {
      const [date] = point;
      return date >= min && date <= max;
    });
  }

  const len = filteredData.length - 1;
  const rangeStart = filteredData[0][1];
  const rangeEnd = filteredData[len][1];
  const increaseFloat = (rangeEnd * 100) / rangeStart - 100;
  const increaseRaw = increaseFloat.toFixed(2);
  const increase = +increaseRaw === increaseFloat ? increaseFloat : increaseRaw;
  const subtitle = `Increase: ${increase}%`;
  const subtitleOptions = {
    text: subtitle,
  };
  chart.setTitle(null, subtitleOptions);
};

const TokenPriceGraph = (props) => {
  const { tokenAddress, isAdmin } = props;
  const precision = isAdmin ? 6 : 3;

  const { loading, data } = useQuery(GET_LAST_PRICE, {
    variables: {
      tokenAddress,
    },
  });

  const [historicalData, setHistoricalData] = useState();

  const chartRef = useRef(null);

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
              price: "" + round(data[1] * 10 ** 6, precision),
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

  const graphOnly = mergeByDayID([], [...data.dayHistoricalDatas]);
  const excelOnly = mergeByDayID([...historicalData], []);
  const merged = mergeByDayID(historicalData, data.dayHistoricalDatas);

  const chartData = merged
    .map((it) => {
      return [
        Number.parseInt(it.dayId) * 1000 * 86400,
        round(Number.parseFloat(it.price / 10 ** 6), precision),
      ];
    })
    .reverse();

  var series = [
    {
      color: "#623a6c",
      name: "Token Price",
      data: chartData,
    },
  ];

  if (isAdmin) {
    const chartDataGraphOnly = graphOnly
      .map((it) => {
        return [
          Number.parseInt(it.dayId) * 1000 * 86400,
          round(Number.parseFloat(it.price / 10 ** 6), precision),
        ];
      })
      .reverse();

    const chartDataExcelOnly = excelOnly
      .map((it) => {
        return [
          Number.parseInt(it.dayId) * 1000 * 86400,
          round(Number.parseFloat(it.price / 10 ** 6), precision),
        ];
      })
      .reverse();

    series = [
      ...series,
      {
        color: "#f54242",
        name: "Token Price (Graph)",
        data: chartDataGraphOnly,
      },
      {
        color: "#f542e0",
        name: "Token Price (Excel)",
        data: chartDataExcelOnly,
      },
    ];
  }

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
          renderIncrease({
            event,
            chart: chartRef.current.chart,
            data: chartData,
          });
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

    series,
  };

  const interval = setInterval(() => {
    if (chartRef.current) {
      clearInterval(interval);
      renderIncrease({
        chart: chartRef.current.chart,
        data: chartData,
      });
    }
  });

  return (
    <>
      <HighchartsReact
        ref={chartRef}
        highcharts={Highcharts}
        constructorType={"stockChart"}
        options={config}
        immutable={true}
      />
    </>
  );
};

export default TokenPriceGraph;
