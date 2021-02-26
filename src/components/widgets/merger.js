import { onChainDayIdStart, maximumDiff } from "../data/tokens";

export const mergeByDayID = (_hist, _actual) => {
  if (_hist.length === 0) {
    return _actual;
  }
  // Extrapolate last history price
  //
  var hist = [..._hist];
  if (hist[0] && _actual[0] && hist[0].dayId === _actual[0].dayId - 1) {
    hist.unshift({
      ...hist[0],
      dayId: _actual[0].dayId,
      date: _actual[0].date,
    });
  }
  const actual = [];
  for (let i = 0; i < _actual.length - 1; i++) {
    actual.push(_actual[i]);
  }

  const histIndex = {};
  const actualIndex = {};
  const key = (o) => o.dayId + "_" + o.token.toLowerCase();

  hist.forEach((h) => (histIndex[key(h)] = h));
  actual.forEach((h) => (actualIndex[key(h)] = h));

  const histOnly = Object.entries(histIndex)
    .filter(([key, _]) => !actualIndex[key])
    .map(([_, value]) => value);

  const actialOnly = Object.entries(actualIndex)
    .filter(([key, _]) => !histIndex[key])
    .map(([_, value]) => value);

  const allKeys = Object.keys(histIndex).concat(Object.keys(actualIndex));
  const resvedKeys = allKeys.filter(
    (key) => histIndex[key] && actualIndex[key]
  );

  const resolved = resvedKeys.map((key) => {
    const hVal = histIndex[key];
    const aVal = actualIndex[key];
    const token = histIndex[key].token;
    const dayId = histIndex[key].dayId;

    const aValPrice = Number.parseFloat(aVal.price);
    const hValPrice = Number.parseFloat(hVal.price);
    const valPercDiff =
      100 * Math.abs((aValPrice - hValPrice) / ((aValPrice + hValPrice) / 2));

    if (dayId < onChainDayIdStart(token)) {
      return {
        ...hVal,
        supply: aVal.supply,
      };
    } else {
      if (valPercDiff > maximumDiff(token)) {
        return {
          ...hVal,
          supply: aVal.supply,
        };
      } else {
        return aVal;
      }
    }
  });

  const unsortedResult = [...histOnly, ...actialOnly, ...resolved];

  const result = unsortedResult.sort(
    (a, b) => b.dayId - a.dayId || b.token.localeCompare(a.token)
  );

  return result;
};
