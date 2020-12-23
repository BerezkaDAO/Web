import { round } from "./round";

var groupBy = function (xs, key) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

const maxAmountAt = (balances, dayId, token) => {
  let balanceAt = 0;
  for (let b of balances.historicalBalances.filter((x) => x.token === token)) {
    if (b.dayId <= dayId) {
      balanceAt = Number.parseInt(b.amount) / 10 ** 18;
    } else {
      return balanceAt;
    }
  }
  return balanceAt;
};

export const computeDailyPrices = (balances, prices) => {
  // Get prices for each day
  //
  const grouped = groupBy(prices, "dayId");
  return Object.values(grouped).map((_its) => {
    const dayId = _its[0].dayId;
    const date = _its[0].date;
    const tokens = {};
    const its = [];
    _its.forEach((it) => {
      const token = it.token;
      if (!tokens[token]) {
        tokens[token] = token;
        its.push(it);
      }
    });
    //console.log(`dayId = ${dayId}`)
    const totalValue = its
      .map((it) => {
        const amount = maxAmountAt(balances, dayId, it.token);
        const price = Number.parseFloat(it.price) / 10 ** 6;
        const totalValue = amount * price;
        //console.log(`dayId = ${dayId}, token = ${it.token}, amount = ${amount}, price = ${price}, totalValue = ${totalValue}`)
        return totalValue;
      })
      .reduce((a, b) => round(a + b, 5), 0);
    return {
      date,
      dayId,
      totalValue,
    };
  });
};
