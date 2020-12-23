import React from "react";
import { NavLink } from "react-router-dom";

class Sidebar extends React.Component {
  render() {
    return (
      <aside className="sidebar-menu">
        <label
          className="sidebar-menu__close"
          htmlFor="sidebar-menu-activation"
        >
          <i className="icon icon-close" />
        </label>
        <div className="sidebar-menu__logo">
          <a href="http://berezka.io">
            <img
              className="sidebar-menu__logo-img"
              src="img/logo.png"
              title="Logo"
              alt="Logo"
            />
          </a>
        </div>
        <nav className="sidebar-menu__items">
          <NavLink className="sidebar-menu__item" to="/account">
            My Account
          </NavLink>
          <NavLink className="sidebar-menu__item" to="/dashboard">
            Dashboard
          </NavLink>
        </nav>
      </aside>
    );
  }
}

export default Sidebar;
