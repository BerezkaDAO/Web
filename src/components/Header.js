import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Header(props) {
  const { connectWeb3, address } = props;
  const [scroll, setScroll] = useState(false);

  useEffect(
    () =>
      window.addEventListener("scroll", () =>
        setScroll(window.pageYOffset > 50)
      ),
    []
  );

  return (
    <header className={"header " + (scroll ? "_scroll" : "")}>
      <div className="header__main">
        <label
          className="header__sidebar-open"
          htmlFor="sidebar-menu-activation"
        >
          <i className="icon icon-menu" />
        </label>
        <nav className="header__menu">
          <Link className="header__menu-item" to="/">
            Home
          </Link>
          <Link className="header__menu-item" to="/">
            About us
          </Link>
          <Link className="header__menu-item" to="/">
            Blog
          </Link>
        </nav>
        <div className="header__title">
          #Berezka DAO - DeFi Asset Management
        </div>
      </div>
      <div
        className="buttons"
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          flex: "0 0 auto",
        }}
      >
        {address ? (
          <div
            className="connect__value header__title"
            style={{ margin: "0 10px 0 0" }}
          >
            {address}
          </div>
        ) : (
          <a className="desktop_only button _light" href onClick={connectWeb3}>
            Connect wallet
          </a>
        )}
        <Link className="button _light" to="/dashboard">
          Dashboard
        </Link>
        <Link className="button" to="/#flex">
          Join Dao
        </Link>
      </div>
    </header>
  );
}

export default Header;
