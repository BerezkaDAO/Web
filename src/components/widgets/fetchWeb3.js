const state = {};

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

export const fetchWeb3Data = async (web3, tokenAddress) => {
  if (state[tokenAddress]) {
    setTimeout(() => {
      delete state[tokenAddress];
    }, 1000 * 60 * 5);
    return new Promise(function (resolve, _) {
      var attempt = function () {
        if (state[tokenAddress] && !state[tokenAddress].loading) {
          resolve(state[tokenAddress].data);
        } else {
          console.log(
            `Passively waiting for web3 data for token ${tokenAddress}`
          );
          setTimeout(function () {
            attempt();
          }, 200);
        }
      };
      attempt();
    });
  }

  state[tokenAddress] = {
    loading: true,
    data: null,
  };

  const contract = new web3.eth.Contract(
    ABI,
    "0xB3c57c8C6dc04785E16292D8b91ef827a88A9548"
  );
  const balances = await contract.methods
    .getNonEmptyTokenBalances(tokenAddress)
    .call();
  const priceParts = {};
  const names = {};

  const balancesIndex = {};
  balances.forEach((balance) => {
    const addr = balance[0];
    if (!balancesIndex[addr]) {
      balancesIndex[addr] = [];
    }
    balancesIndex[addr].push(balance);
  });

  const balancesMerged = [];
  for (let addr of Object.keys(balancesIndex)) {
    const parts = balancesIndex[addr];
    const sum =
      "" +
      parts
        .map((p) => Number.parseInt(p[1]))
        .reduce((accumulator, currentValue) => accumulator + currentValue);
    balancesMerged.push([addr, sum]);
  }

  console.log(JSON.stringify(balancesMerged));
  for (let balance of balancesMerged) {
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
    const price = await contract.methods.getTokenPrice(amount, token).call();
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

  state[tokenAddress] = {
    loading: false,
    data: pricePercent,
  };

  return pricePercent;
};
