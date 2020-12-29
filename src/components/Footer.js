import React from "react";
import { Link } from "react-router-dom";

function Footer(props) {
  return (
    <footer className="footer">
      <form className="footer__form">
        <input
          className="input _light"
          type="email"
          placeholder="Email for updates"
        />
        <div className="buttons buttons-footer">
          <a
            className="button _light _middle"
            href
            style={{ fontWeight: 500, fontSize: "12px" }}
          >
            Get updates
          </a>
          <span style={{ margin: "3.5px 9.5px" }}>
            Lets build DeFi Community Together
          </span>
        </div>
      </form>
      <div className="footer__bottom">
        <nav className="footer__menu">
          <Link className="footer__menu-item" to="/privacy">
            Privacy Policy
          </Link>
          <Link className="footer__menu-item" to="/cookie">
            Cookie Policy
          </Link>
        </nav>
        <div className="buttons-header">
          <Link className="button _light" to="/dashboard">
            Dashboard
          </Link>
          <Link className="button" to="/request">
            Join Dao
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
