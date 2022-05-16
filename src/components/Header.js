import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { defaultToken } from "./data/tokens";

function Header(props) {
  const { connectWeb3, disconnectWeb3, address } = props;
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
          <a
            className="header__menu-item"
            target="_blank"
            href="https://medium.com/berezka-dao/what-is-the-berezka-dao-bce81ca1063d"
          >
            About us
          </a>
          <a
            className="header__menu-item"
            target="_blank"
            href="https://medium.com/berezka-dao"
          >
            Blog
          </a>
        </nav>
        <div className="desktop_only header__title">
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
            onClick={disconnectWeb3}
          >
            <div className={"wallet-address__desktop"}>{address}</div>

            <div className={"wallet-address__mobile"}>
              {address.slice(0, 9)}...{address.slice(-5)}
            </div>
          </div>
        ) : (
          <a className="desktop_only button _light" href onClick={connectWeb3}>
            Connect wallet
          </a>
        )}

        <div>
          <Link className="button _light" to="/dashboard">
            Dashboard
          </Link>
          <Link className="button" to={`/#${defaultToken[0]}`}>
            Join Dao
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
