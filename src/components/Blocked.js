import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import SidebarActivation from "./SidebarActivation";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import HeaderBlocked from "./HeaderBlocked";
import BlockedPolicy from "./BlockedPolicy";

function Main() {
  return (
    <Router>
      <main className="main">
        <SidebarActivation />
        <Sidebar isBlocked={true} />
        <header className="header" />
        <HeaderBlocked />
        <BlockedPolicy />
        <Footer isBlocked={true} />
      </main>
    </Router>
  );
}

export default Main;
