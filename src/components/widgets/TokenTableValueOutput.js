import React from "react";

function TokenTableValueOutput(props) {
  const { value, render } = props;

  if (value) {
    return <>{render(value)}</>;
  } else {
    return <>&#8212;</>;
  }
}

export default TokenTableValueOutput;
