import React from "react";
import Blocked from "./Blocked";
import { blacklist } from "./data/blacklist";

function CountryBlock(props) {
  const { countryCode } = props;

  return !blacklist.includes(countryCode) ? props.children : <Blocked />;
}

export default CountryBlock;
