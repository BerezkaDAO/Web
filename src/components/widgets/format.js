import { round } from "./round";
const sumDecimal = (value, pc) =>
  round(value, 2)
    .toFixed(pc)
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");

export const ftmAmount = (value) => `${sumDecimal(value, 2)}`;
export const fmtDollatAmount = (value) => `$ ${sumDecimal(value, 0)}`;
export const fmtDollatAmountSmall = (value) => `$ ${sumDecimal(value, 2)}`;
