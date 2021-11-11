import React, { useEffect, useState } from "react";
import { round } from "./round";
import { colorByIndex } from "./colors";
import { fetchWeb3Data } from "./daoes";
import Highcharts from "highcharts/highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";

const PortfolioPartsGraph = (props) => {
  const { tokenAddress } = props;

  const [loading, setLoading] = useState(true);
  const [partList, setPartList] = useState();

  useEffect(() => {
    let isCancelled = false;

    const fn = async () => {
      setLoading(true);

      const pricePercent = await fetchWeb3Data(tokenAddress);

      if (!isCancelled) {
        setLoading(false);
        setPartList(pricePercent);
      }
    };
    fn();

    return () => {
      isCancelled = true;
    };
  }, [tokenAddress]);

  if (!partList || loading) {
    return <p>Loading...</p>;
  }

  const maxRadius = 112;
  const minRadius = 38;
  const radiusStep = (maxRadius - minRadius) / partList.length;

  const series = partList.map((item, index) => {
    const name = item.name;
    const y = round(item.pricePercentValue, 1);
    const radius = maxRadius - radiusStep * index;
    const innerRadius = radius - radiusStep + (index + 1);
    const color = colorByIndex(index);
    return {
      name,
      data: [
        {
          color,
          radius: radius + "%",
          innerRadius: innerRadius + "%",
          y,
        },
      ],
    };
  });

  const paneBackgrounds = series.map((item) => {
    const { radius, innerRadius, color } = item.data[0];
    const backgroundColor = "white";
    return {
      backgroundColor,
      innerRadius,
      outerRadius: radius,
      borderWidth: 0,
    };
  });

  const config = {
    exporting: {
      enabled: false,
    },
    chart: {
      type: "solidgauge",
      height: "110%",
    },

    title: {
      text: null,
    },

    tooltip: {
      borderWidth: 0,
      backgroundColor: "none",
      shadow: false,
      style: {
        fontSize: "16px",
        textAlign: "center",
      },
      valueSuffix: "%",
      useHTML: true,
      pointFormatter() {
        const point = this,
          { name } = this.series,
          value = point.y;
        return `
                    <div style="text-align: center">
                        <span>${name}</span>
                        <br>
                        <span style="font-size:2em; color: ${point.color};">${value}%</span>
                    </div>
                `;
      },
      positioner: function (labelWidth) {
        return {
          x: (this.chart.chartWidth - labelWidth) / 2,
          y: this.chart.plotHeight / 2 - 25,
        };
      },
    },

    pane: {
      startAngle: 360,
      endAngle: 0,
      background: paneBackgrounds,
    },

    yAxis: {
      min: 0,
      max: 100,
      lineWidth: 0,
      tickPositions: [],
    },

    plotOptions: {
      solidgauge: {
        dataLabels: {
          enabled: false,
        },
        //linecap: 'round',
        stickyTracking: false,
        //rounded: true
      },
    },
    series,
  };

  highchartsMore(Highcharts);
  solidGauge(Highcharts);

  return (
    <>
      <HighchartsReact
        highcharts={Highcharts}
        options={config}
        immutable={true}
      />
    </>
  );
};

export default PortfolioPartsGraph;
