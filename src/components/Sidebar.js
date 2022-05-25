import React from "react";
import { NavLink } from "react-router-dom";

function Sidebar(props) {
  const { isBlocked } = props;
  return (
    <aside className="sidebar-menu">
      <label className="sidebar-menu__close" htmlFor="sidebar-menu-activation">
        <i className="icon icon-close" />
      </label>
      <div className="sidebar-menu__logo">
        <a href="http://berezka.io">
          <img
            className="sidebar-menu__logo-img"
            src="/img/logo.png"
            title="Logo"
            alt="Logo"
          />
        </a>
      </div>
      {!isBlocked ? (
        <nav className="sidebar-menu__items">
          <NavLink className="sidebar-menu__item active" to="/account">
            My Account
          </NavLink>
          <NavLink
            activeClassName="none"
            className="sidebar-menu__item"
            to="/dashboard"
          >
            Dashboard
          </NavLink>
          {false ? (
            <NavLink
              activeClassName="none"
              className="sidebar-menu__item"
              to="/referral"
            >
              Referral
            </NavLink>
          ) : (
            ""
          )}
        </nav>
      ) : (
        ""
      )}
    </aside>
  );
}

export default Sidebar;
