import React, { useEffect, useState } from "react";
import { round } from "./round";
import { useTokenData } from "./useTokenData";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";
import { fetchBlastSourcegraph } from "./ExternalBlastDao";

export const TokenAmountGraphBlastDao = () => {
  const [chartData, setChartData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetchBlastSourcegraph().then((data) => {
      setChartData(data);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <>Loading...</>;
  }

  const titleOptions = {
    text: null,
  };

  const config = {
    exporting: {
      enabled: false,
    },
    navigator: {
      enabled: false,
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
