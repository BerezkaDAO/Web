const UNISWAP = require("@uniswap/sdk");

const USDC_TOKEN = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

export const oracle = async (token) => {
  // Test token (for testnet usage)
  //
  if (
    token.toLowerCase() ===
    "0x561b99cdc5a2714f722dc2ece1123fafe7ad2e8f".toLowerCase()
  ) {
    // Return berezka flex price
    //
    token = "0x0D7DeA5922535087078dd3D7c554EA9f2655d4cB".toLowerCase();
  }

  // Determine Reference (DEX) price
  //
  const reference = await uniswapPrice2(token);

  // Get actual price from API server
  //
  const berezka = await berezkaPrice(token);

  let result = 0;

  // Check that both queries are successfull
  //
  if (reference.success && berezka.success) {
    // Check price actuality
    //
    const refDayId = Math.floor(reference.date / 86400);
    const berDayId = Math.floor(berezka.date / 86400);

    if (refDayId <= berDayId) {
      // Check price difference
      //
      const A = reference.price;
      const B = berezka.price;
      const diffInPercents = 100 * Math.abs((A - B) / ((A + B) / 2));
      if (diffInPercents < 5) {
        result = berezka.price;
      }
    }
  }

  return result;
};

const uniswapPrice2 = async (token) => {
  const TOKEN = new UNISWAP.Token(UNISWAP.ChainId.MAINNET, token, 18);
  const USDC = new UNISWAP.Token(UNISWAP.ChainId.MAINNET, USDC_TOKEN, 6);

  const pair = await UNISWAP.Fetcher.fetchPairData(TOKEN, USDC);
  const route = new UNISWAP.Route([pair], TOKEN);

  const price = Number.parseFloat(route.midPrice.toSignificant()) * 10 ** 6;

  return {
    success: true,
    price,
    date: new Date().getTime() / 1000,
  };
};

const berezkaPrice = async (token) => {
  const result = await fetch(`price/${token}`)
    .then((res) => res.json())
    .catch((_) => ({}));

  const isFetchSuccess =
    result && result[0] && result[0].price && result[0].date;

  if (isFetchSuccess) {
    return {
      ...result[0],
      success: true,
    };
  } else {
    return {
      success: false,
    };
  }
};
