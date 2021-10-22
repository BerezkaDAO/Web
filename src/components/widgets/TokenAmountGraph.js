import React from "react";
import { round } from "./round";
import { useTokenData } from "./useTokenData";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

const TokenAmountGraph = (props) => {
  const { tokenAddress, isLegacy } = props;
  const { loading, merged } = useTokenData(tokenAddress, isLegacy);

  if (loading) {
    return <>Loading...</>;
  }

  const chartData = merged
    .map((it) => {
      return [
        Number.parseInt(it.date) * 1000,
        round(
          Number.parseInt(
            round(Number.parseFloat(it.totalPrice) / 10 ** 18 / 10 ** 6, 0) -
              (it.totalCarry > 0 ? it.totalCarry : 0 || 0)
          ),
          3
        ),
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
