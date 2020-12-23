import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SidebarActivation from "./SidebarActivation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import HeaderBalance from "./HeaderBalance";
import Footer from "./Footer";
import Index from "./Index";
import Dashboard from "./Dashboard";
import Account from "./Account";
import TokenRequest from "./TokenRequest";
import CookiePolicy from "./CookiePolicy";
import PrivacyPolicy from "./PrivacyPolicy";
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphClient";

function Main(props) {
  const { connectWeb3, address, web3Global } = props;
  return (
    <ApolloProvider client={client}>
      <Router>
        <main className="main">
          <SidebarActivation />
          <Sidebar />
          <Header address={address} connectWeb3={connectWeb3} />
          <HeaderBalance />
          <Switch>
            <Route exact path="/">
              <Index connectWeb3={connectWeb3} />
            </Route>
            <Route path="/dashboard">
              <Dashboard web3Global={web3Global} />
            </Route>
            <Route path="/account">
              <Account
                address={address}
                web3Global={web3Global}
                connectWeb3={connectWeb3}
              />
            </Route>
            <Route path="/cookie">
              <CookiePolicy />
            </Route>
            <Route path="/privacy">
              <PrivacyPolicy />
            </Route>
            <Route path="/request">
              <TokenRequest connectWeb3={connectWeb3} />
            </Route>
          </Switch>
          <Footer />
        </main>
      </Router>
    </ApolloProvider>
  );
}

export default Main;
