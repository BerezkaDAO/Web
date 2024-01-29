import React from "react";
import { Link } from "react-router-dom";
import { defaultToken } from "./data/tokens";

function Footer(props) {
  const { isBlocked } = props;
  return (
    <footer className="footer">
      <div className="footer__contacts">
        <h3 className="footer__contacts-header">Contacts</h3>

        <div className="footer__contacts-item">
          Email:{" "}
          <a className="footer__contacts-link" href="mailto:hello@berezka.io">
            hello@berezka.io
          </a>
        </div>
        <div className="footer__contacts-item">
          Telegram{" "}
          <a className="footer__contacts-link" href="https://t.me/Asc100500">
            @Asc100500
          </a>
        </div>
      </div>

      {!isBlocked ? (
        <div className="footer__bottom">
          <nav className="footer__menu">
            <Link className="footer__menu-item" to="/privacy">
              Privacy Policy
            </Link>
            <Link className="footer__menu-item" to="/cookie">
              Cookie Policy
            </Link>
          </nav>
          <div className="buttons">
            <Link className="button _light" to="/dashboard">
              Dashboard
            </Link>
            <Link className="button" to={`/#${defaultToken[0]}`}>
              Join Dao
            </Link>
          </div>
        </div>
      ) : (
        ""
      )}
    </footer>
  );
}

export default Footer;
