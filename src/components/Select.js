import React, { useState } from "react";
import { tokenIcons } from "./data/tokens";

export const getCurrencyIconPath = (symbol) => {
  const token = tokenIcons[symbol];

  if (!token) {
    return "";
  }
  return `/img/${token.image}.png`;
};

function Select(props) {
  const { value, options, setValue, valueDisplay } = props;

  const [selectOpen, setSelectOpen] = useState(false);

  const toggleSelectOpen = () => {
    setSelectOpen(!selectOpen);
  };

  const closeAll = () => {
    setSelectOpen(false);
  };

  return (
    <div className={"select" + (selectOpen ? " active" : "")}>
      <div className="select__input-container" onClick={toggleSelectOpen}>
        <input
          className="select__input"
          type="text"
          value={value}
          required
          readOnly
        />
        <div className="select__value">
          <img src={getCurrencyIconPath(value)} title alt="" />
          <span>{valueDisplay(value)}</span>
        </div>
      </div>
      <div className="select__options">
        {options.map((option) => (
          <a
            key={option}
            className={"select__option" + (value === option ? " _choosed" : "")}
            onClick={() => {
              closeAll();
              setValue(option);
            }}
            href
          >
            <img src={getCurrencyIconPath(option)} title alt="" />
            <span>{valueDisplay(option)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Select;
