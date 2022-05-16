import React from "react";

function Slider() {
  return (
    <input
      className="input__range"
      type="range"
      defaultValue="50"
      min="1"
      max="100"
    />
  );
}

export default Slider;
