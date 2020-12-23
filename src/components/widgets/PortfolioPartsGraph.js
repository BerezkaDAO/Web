import React, { useEffect, useState } from "react";
import { round } from "./round";
import { colorByIndex } from "./colors";
import Highcharts from "highcharts/highcharts";
import highchartsMore from "highcharts/highcharts-more";
import solidGauge from "highcharts/modules/solid-gauge";
import HighchartsReact from "highcharts-react-official";

const ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_registryAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "contract ERC20",
        name: "_fromToken",
        type: "address",
      },
      {
        internalType: "contract ERC20",
        name: "_destToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
    ],
    name: "getExpectedReturn",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "getNonEmptyTokenBalances",
    outputs: [
      {
        components: [
          {
            internalType: "address",
            name: "token",
            type: "address",
          },
          {
            internalType: "int256",
            name: "amount",
            type: "int256",
          },
        ],
        internalType: "struct AdaptedBalance[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "getPrice",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "int256",
        name: "_amount",
        type: "int256",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "getTokenPrice",
    outputs: [
      {
        internalType: "int256",
        name: "",
        type: "int256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];

const ABI_TICKER = [
  {
    constant: true,
    inputs: [],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    type: "function",
  },
];

const PortfolioPartsGraph = (props) => {
  const { tokenAddress, web3 } = props;

  const [loading, setLoading] = useState(true);
  const [partList, setPartList] = useState();

  useEffect(() => {
    let isCancelled = false;

    const fn = async () => {
      setLoading(true);
      if (!web3) {
        return;
      }
      const contract = new web3.eth.Contract(
        ABI,
        "0xB3c57c8C6dc04785E16292D8b91ef827a88A9548"
      );
      const balances = await contract.methods
        .getNonEmptyTokenBalances(tokenAddress)
        .call();
      const priceParts = {};
      const names = {};
      for (let balance of balances) {
        const token = balance[0];
        const amount = balance[1];
        console.log(`Token: ${token}`);
        if (token === "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE") {
          names[token] = "Ethereum";
        } else {
          try {
            const contractTicker = new web3.eth.Contract(ABI_TICKER, token);
            const name = await contractTicker.methods.name().call();
            names[token] = name;
          } catch (e) {
            console.log(`Error getting name for token: ${token}`);
            names[token] = token;
          }
        }
        const price = await contract.methods
          .getTokenPrice(amount, token)
          .call();
        if (!priceParts[token]) {
          priceParts[token] = 0;
        }
        priceParts[token] += Number.parseFloat(price);
      }
      const priceTotal = Object.values(priceParts).reduce((a, b) => a + b, 0);
      const pricePercent = [];
      for (const token of Object.keys(priceParts)) {
        const pricePercentValue = (priceParts[token] / priceTotal) * 100;
        if (pricePercentValue > 0.1) {
          pricePercent.push({
            token,
            pricePercentValue,
            name: names[token],
          });
        }
      }
      pricePercent.sort((a, b) => b.pricePercentValue - a.pricePercentValue);

      if (!isCancelled) {
        setLoading(false);
        setPartList(pricePercent);
      }
    };
    fn();

    return () => {
      isCancelled = true;
    };
  }, [tokenAddress, web3]);

  if (!partList || loading) {
    return <p>Loading...</p>;
  }

  const maxRadius = 112;
  const minRadius = 38;
  const radiusStep = (maxRadius - minRadius) / partList.length;

  const series = partList.map((item, index) => {
    const name = item.name;
    const y = round(item.pricePercentValue, 3);
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
      startAngle: 0,
      endAngle: 360,
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
