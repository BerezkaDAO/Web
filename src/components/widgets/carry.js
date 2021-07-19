import { fetchDedupe } from "fetch-dedupe";
import { nameByAddress, tokenInfo } from "../data/tokens";

const INITIAL_CARRY_DAYID = 18668;
const INITIAL_CARRY = {
  flex: {
    price: 1.587841891,
    totalCarry: 29767.91,
  },
  dyna: {
    price: 3.255011,
    totalCarry: 48091.28,
  },
  emiflex: {
    price: 1.7563574,
    totalCarry: 6391.09,
  },
  deposit: {
    price: 1.12880471717,
    totalCarry: 647.41,
  },
};

const CORRECTION_START = 1619921282 * 1000;
const NEGATIVE_CERRY_START = 1626555600 * 1000;

const removeDuplicates = (array) => {
  let uniq = {};
  return array.filter((obj) => !uniq[obj.date] && (uniq[obj.date] = true));
};

const checkIsLastDay = (dt) => {
  var test = new Date(dt.getTime());
  test.setDate(test.getDate() + 1);
  return test.getDate() === 1;
};

export const fetchCarry = async (tokenAddress) => {
  const name = nameByAddress(tokenAddress);
  //console.log(`fetchCarry: Got name by address: ${name}`);
  return await fetchDedupe(`/carry/${name}`)
    .then((res) => {
      //console.log(`fetchCarry: ${JSON.stringify(res)}`);
      return res;
    })
    .then((res) => res.data);
};

export const computeCarry = (tokenAddress, mergedRaw, recvCarry) => {
  const token = nameByAddress(tokenAddress);
  const merged = removeDuplicates(mergedRaw);
  const carryPercent = tokenInfo[token].carryPercent;
  const mutable = [...merged]
    .filter((it) => it.dayId >= INITIAL_CARRY_DAYID)
    .map((x) => ({ ...x }));
  const rest = merged.filter((it) => it.dayId < INITIAL_CARRY_DAYID);
  const daysAgo = merged[0].dayId - INITIAL_CARRY_DAYID - 1;
  for (let i = daysAgo; i >= 0; i--) {
    const dayId = mutable[i].dayId;
    //console.log(`Computing daily carry for day: ${dayId}`);
    const currentDayData = mutable[i];
    const prevDayData = mutable[i + 1];
    const Q = currentDayData.supply / 10 ** 18;
    const P = currentDayData.price / 10 ** 6;
    let PprevAfterCarry = 0;
    let totalCarry = 0;
    if (prevDayData.carry) {
      //console.log(`Got carry`);
      PprevAfterCarry = prevDayData.carry.priceAfterCarry;
      totalCarry = prevDayData.carry.totalCarry;
    } else if (prevDayData.dayId === INITIAL_CARRY_DAYID) {
      //console.log(
      //  `Got default carry ${INITIAL_CARRY[token].price} ${INITIAL_CARRY[token].totalCarry}`
      //);
      PprevAfterCarry = INITIAL_CARRY[token].price;
      totalCarry = INITIAL_CARRY[token].totalCarry;
    } else {
      throw new Error(
        `Can not compute carry for prev day, prev day is ${prevDayData.dayId}`
      );
    }
    const currentDayTotalCost = Q * P;
    const prevDayTotalCost = Q * PprevAfterCarry;
    const dailyGrowth = currentDayTotalCost - prevDayTotalCost;
    let dailyCarry = dailyGrowth > 0 ? dailyGrowth * carryPercent : 0;
    const nav = currentDayTotalCost;
    let priceAfterCarry =
      (nav - dailyCarry) / Q === P ? PprevAfterCarry : (nav - dailyCarry) / Q;
    if (priceAfterCarry < PprevAfterCarry) {
      priceAfterCarry = PprevAfterCarry;
    }
    const date = new Date(currentDayData.dayId * 86400 * 1000);
    let isLastDay = false;
    let correction = 0;
    if (
      checkIsLastDay(date) &&
      priceAfterCarry > P &&
      date.getTime() > CORRECTION_START
    ) {
      const priceAfterCarry2 = P;
      const prevDayTotalCost2 = Q * priceAfterCarry;
      const dailyGrowth2 = currentDayTotalCost - prevDayTotalCost2;
      dailyCarry = dailyGrowth2 * carryPercent;
      correction = priceAfterCarry / priceAfterCarry2;
      priceAfterCarry = priceAfterCarry2;
      isLastDay = true;
    }
    totalCarry += dailyCarry;
    //console.log(`Got dailyCarry ${dailyCarry} ${totalCarry}`);
    let deductCarry = 0;
    recvCarry
      .filter((c) => c.dayId === dayId)
      .map((c) => c.sum)
      .forEach((sum) => {
        deductCarry += sum;
      });
    totalCarry -= deductCarry;
    //console.log(`Got deductCarry ${deductCarry}`);
    let adaptedCarry = totalCarry;
    if (date.getTime() > NEGATIVE_CERRY_START) {
      adaptedCarry = totalCarry > 0 ? totalCarry : 0;
    }
    const priceAfterCarryReal = (nav - adaptedCarry) / Q;
    mutable[i] = {
      ...mutable[i],
      totalCarry: totalCarry,
      priceAfterCarry: priceAfterCarryReal * 10 ** 6,
      carry: {
        dayId: currentDayData.dayId,
        Q,
        P,
        currentDayTotalCost,
        prevDayTotalCost,
        dailyGrowth,
        dailyCarry,
        nav,
        PprevAfterCarry,
        priceAfterCarry,
        totalCarry,
        deductCarry,
        priceAfterCarryReal,
        isLastDay,
        correction,
      },
    };
  }
  return [...mutable, ...rest];
};
