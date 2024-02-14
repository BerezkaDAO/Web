export const defaultToken = [];
export const tokenInfo = {};

export const tokens = [];

export const tokenAddresses = [];

export const tokenIcons = {
  "96c0154b-ac5b-30d7-7b2a-483897c8d800": {
    image: "logo",
  },
  BEETH: {
    image: "logo",
  },
  WETH: {
    image: "type6",
  },
  MATIC: {
    image: "type7",
  },
  ETH: {
    image: "type2",
  },
  USDT: {
    image: "type4",
  },
  USDC: {
    image: "type5",
  },
  DAI: {
    image: "type3",
  },
};

export const currencyInfo = {
  weth: {
    symbol: "WETH",
    address: "00000000-0000-0000-0000-000000000005",
  },
  matic: {
    symbol: "MATIC",
    address: "00000000-0000-0000-0000-000000000005",
  },
  eth: {
    symbol: "ETH",
    address: "00000000-0000-0000-0000-000000000001",
  },
  usdt: {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
  },
  usdc: {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
  },
  dai: {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
  },
};

export const nameByAddress = (address) =>
  [...tokens]
    .map((token) => ({
      ...tokenInfo[token],
      name: token,
    }))
    .find((info) => info.address.toLowerCase() === address.toLowerCase()).name;
