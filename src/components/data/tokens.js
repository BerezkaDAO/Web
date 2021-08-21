export const tokenInfo = {
  flex: {
    name: "Flex",
    fullName: "Berezka Flex",
    apiName: "berezka",
    address: "0x0D7DeA5922535087078dd3D7c554EA9f2655d4cB",
    tableName: "Flex",
    symbol: "FLEX",
    dao: "0xac3f8e8518139f732218ff542d21cd6968e8209d",
    onChainDayIdStart: 18550,
    maximumDiff: 4,
    enableCarry: true,
    vaults: [
      "0xf8a8d25049ebfaf36cf1dd7ff51ebd0777fc9b32",
      "0xc6f7cb66f28954d1eb265d3ae3e24ff20d45d433",
      "0x99e9891ceb85b9eebe2e29a2b525d3b13a5b390c",
    ],
    isDexEnabled: true,
    carryPercent: 0.2,
  },
  emiflex: {
    name: "EmiFlex",
    apiName: "emiflex",
    address: "0xD68E7b64888F095Ee15f18347ccA7e453E0DBe17",
    tableName: "EmiFlex",
    symbol: "EFLX",
    dao: "0xef5d72e2d0cd8943e02aa4118bf94424017c8fdf",
    onChainDayIdStart: 18550,
    maximumDiff: 2,
    enableCarry: true,
    vaults: [
      "0xe327b30c414a94382d1a5b6416f0f241eea1f653",
      "0x64079ab1273b22405a302347fe627760e462f0c3",
    ],
    carryPercent: 0.2,
  },
  dyna: {
    name: "Dynamic",
    apiName: "dyna",
    address: "0xdc76450fd7e6352733fe8550efabff750b2de0e3",
    tableName: "Dynamic",
    symbol: "DYNA",
    dao: "0x95c4c0bcffd5ff8b5796f395b20db7414b34954c",
    onChainDayIdStart: 18550,
    maximumDiff: 4,
    enableCarry: true,
    vaults: ["0xd7b25a928f2de0beff34247a42fcb219b04323cc"],
    isDexEnabled: true,
    carryPercent: 0.2,
  },
  deposit: {
    name: "Deposit",
    apiName: "deposit",
    address: "0xf6ce9BFA82D1088d3257a76ec2e0ce1C8060BF8c",
    tableName: "Deposit",
    symbol: "BDQ",
    dao: "0xf5ac13a709e7bc86001b7107c8839b6d6f6046a3",
    onChainDayIdStart: 18613,
    maximumDiff: 1,
    enableCarry: true,
    vaults: [
      "0xac1c30c8ae96a6cdd392bc2593a6e00d964b73c2",
      "0xbea828430c546b7a439ad6322e1d7fb428b0bed0",
      "0x919bba8bcde41b5845e8d7a94ed0543577cf26b1",
      "0x01a4244a5FD99f2d29704438fa5cBb89B59657d7",
      "0x6d36BCC57Ee91Ccf5860BA8361031661697686d5",
    ],
    withdrawAgent: "0xac1c30c8ae96a6cdd392bc2593a6e00d964b73c2",
    withdrawEnabled: true,
    carryPercent: 0.15,
  },
  skyflex: {
    address: "0x26677EB24FD007Ad279FC55f367De31482E1bF54",
    apiName: "skyflex",
    name: "SkyFlex",
    tableName: "SkyFlex",
    isLegacy: true,
    vaults: [
      "0x49a59d505b40f9db89bba418419342980f7b6605",
      "0x1eb038f9c4d3a081577a061dfa644ec2ea3288c3",
      "0x60d231e8da6673b20b2aee67bdf2d8251784625b",
      "0x753fe5ddb9d4e4888e2959a3c5a48233e461070a",
      "0x369D9617fFCF1B6C5d1427CD7A060c17D3c414db",
      "0x1c68896d5d16a45675e862868812a01197a4fa02",
      "0xac98b1b553d41117ff76f327803f614af21c088e",
    ],
    carryPercent: 0.2,
  },
  moneytree: {
    address: "0xb4c482fbbc3a9fa956af48a9749cc26e001f19f7",
    apiName: "moneytree",
    name: "MoneyTree",
    tableName: "MoneyTree",
    isLegacy: true,
    carryPercent: 0.2,
    vaults: [
      "0xe917a3954e301f153e0157e2537a7a49dd6eceaf",
      "0xb549779cd03170521601bb05e33d929f1ccfb382",
    ],
  },
  rumuflex: {
    address: "0xc0174b778f5a0792f681e5429730ee7445e8ea9f",
    apiName: "rumuflex",
    name: "RumuFlex",
    tableName: "RumuFlex",
    isLegacy: true,
    carryPercent: 0.2,
    vaults: [
      "0x68adb99cf632a996c406b68be4c4124121df2972",
      "0x716cf745300939675618c3f9f48089b62bd0a728",
    ],
  },
  yolka: {
    address: "0x1a8051e22bFEeeE50d01475bf8489Ac489234122",
    apiName: "yolka",
    name: "Yolka",
    tableName: "Yolka",
    isLegacy: true,
    carryPercent: 0.2,
    vaults: [],
  },
  hedge: {
    address: "0x6408da01CdCE025265652e8a3DAb88C85301111b",
    apiName: "hedge",
    name: "Hedge DAO",
    tableName: "Hedge DAO",
    isLegacy: true,
    carryPercent: 0.2,
    vaults: ["0xc0b1408a2dc7a60b9a2edc7c8ae3d33fa36a38a2"],
  },
  btceth: {
    address: "0x0586cfc19dbf0894a7ab0949b7c0cde1608d126c",
    apiName: "cbdao",
    name: "BTC/ETH",
    tableName: "BTC/ETH",
    carryPercent: 0.2,
    vaults: ["0xc0cc06ed6a8932fde3d760b3704062fe45dfc739"],
  },
};

export const tokens = ["flex", "deposit", "dyna", "emiflex"];

export const dashboardTokens = [
  "flex",
  "deposit",
  "dyna",
  "emiflex",
  "skyflex",
  "moneytree",
  "rumuflex",
  "yolka",
  "hedge",
];

export const legacyTokens = [
  "skyflex",
  "btceth",
  "moneytree",
  "rumuflex",
  "yolka",
  "hedge",
];

export const allTokens = tokens.map((token) => tokenInfo[token]);

export const tokenAddresses = tokens.map((token) => tokenInfo[token].address);

export const legacyTokenAddresses = legacyTokens.map(
  (token) => tokenInfo[token].address
);

export const currencyInfo = {
  usdt: {
    symbol: "USDT",
    address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    decimals: 6,
    image: "type4",
  },
  usdc: {
    symbol: "USDC",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    decimals: 6,
    image: "type5",
  },
  dai: {
    symbol: "DAI",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    decimals: 18,
    image: "type3",
  },
};

export const currencies = ["usdt", "usdc", "dai"];

export const apiNameByAddress = (address) =>
  [...tokens, ...legacyTokens]
    .map((token) => tokenInfo[token])
    .find((info) => info.address.toLowerCase() === address.toLowerCase())
    .apiName;

export const nameByAddress = (address) =>
  [...tokens, ...legacyTokens]
    .map((token) => ({
      ...tokenInfo[token],
      name: token,
    }))
    .find((info) => info.address.toLowerCase() === address.toLowerCase()).name;

export const onChainDayIdStart = (address) =>
  tokens
    .map((token) => tokenInfo[token])
    .find((info) => info.address.toLowerCase() === address.toLowerCase())
    ?.onChainDayIdStart;

export const maximumDiff = (address) =>
  tokens
    .map((token) => tokenInfo[token])
    .find((info) => info.address.toLowerCase() === address.toLowerCase())
    ?.maximumDiff;

// 0x108977FE1Cfd10f27D9591C33b8FE9733FD83D2C
