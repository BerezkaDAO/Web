import React, { useRef } from "react";
import { round } from "./round";
import { useTokenData } from "./useTokenData";
import Highcharts from "highcharts/highstock";
import HighchartsReact from "highcharts-react-official";

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
  const { tokenAddress, isAdmin, isLegacy } = props;
  const precision = isAdmin ? 6 : 3;

  const { loading, merged, graphOnly, excelOnly } = useTokenData(
    tokenAddress,
    isLegacy,
    {
      precision: 6,
      computeSeparate: true,
    }
  );

  const chartRef = useRef(null);

  if (loading) {
    return <>Loading...</>;
  }

  const chartData = merged
    .map((it) => {
      return [
        Number.parseInt(it.dayId) * 1000 * 86400,
        round(
          Number.parseFloat((it.priceAfterCarry || it.price) / 10 ** 6),
          precision
        ),
      ];
    })
    .reverse();

  var series = [
    {
      color: "#008cb9",
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
          round(
            Number.parseFloat((it.priceAfterCarry || it.price) / 10 ** 6),
            precision
          ),
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
        color: "#08ff39",
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
