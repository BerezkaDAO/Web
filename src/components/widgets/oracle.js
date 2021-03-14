export const oracle = async (token) => {
  // Test token
  //
  if (
    token.toLowerCase() ===
    "0x561b99cdc5a2714f722dc2ece1123fafe7ad2e8f".toLowerCase()
  ) {
    // Return berezka flex price
    //
    token = "0x0D7DeA5922535087078dd3D7c554EA9f2655d4cB".toLowerCase();
  }

  const reference = await uniswapPrice(token);
  const berezka = await berezkaPrice(token);

  let result = 0;

  if (reference.success && berezka.success) {
    // Check price actuality
    //
    const refDayId = Math.ceil(reference.date / 86400);
    const berDayId = Math.ceil(berezka.date / 86400);

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

const uniswapPrice = async (token) => {
  const query = {
    query: `{tokenDayDatas(first: 3, orderBy: date, orderDirection: desc, where: { token: \"${token.toLowerCase()}\"}) { id date token { id symbol } priceUSD } }`,
  };
  const result = await fetch("/subgraphs/name/uniswap/uniswap-v2", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(query),
  })
    .then((res) => res.json())
    .catch((_) => ({}));

  const isFetchSuccess =
    result.data && result.data.tokenDayDatas && result.data.tokenDayDatas[0];

  if (isFetchSuccess) {
    try {
      const price = result.data.tokenDayDatas[0].priceUSD;
      const priceAdjusted = Math.round(price * 10 ** 6);
      return {
        success: true,
        date: result.data.tokenDayDatas[0].date,
        price: priceAdjusted,
      };
    } catch (e) {
      return {
        success: false,
      };
    }
  } else {
    return {
      success: false,
    };
  }
};

const berezkaPrice = async (token) => {
  const result = await fetch(`/price/${token}`)
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
