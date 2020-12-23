import React, { useState } from "react";

function Select(props) {
  const { value, options, setValue, valueDisplay, valueImage } = props;

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
          <img src={`/img/${valueImage(value)}.png`} title alt />
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
            <img src={`/img/${valueImage(option)}.png`} title alt />
            <span>{valueDisplay(option)}</span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Select;
