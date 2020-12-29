import React from "react";

function TokenTableValueOutput(props) {
  const { value, render } = props;

  if (value) {
    return <>{render(value)}</>;
  } else {
    return <span className="placeholder">&#8211;</span>;
  }
}

export default TokenTableValueOutput;
