import React from "react";

const MAX_INPUT_RANGE = 20;

function Slider({ changeReferral }) {
  const changeHandler = async (e) => {
    console.log(e);
    const { value } = e.target;
    await changeReferral({
      owner_percent: value,
      referral_percent: MAX_INPUT_RANGE - value,
    });
  };
  return (
    <input
      className="input__range"
      onChange={changeHandler}
      type="range"
      defaultValue="0"
      min="1"
      max="20"
    />
  );
}

export default Slider;
