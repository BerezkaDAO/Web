import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SidebarActivation from "./SidebarActivation";
import Sidebar from "./Sidebar";
import Header from "./Header";
import HeaderBalance from "./HeaderBalance";
import HeaderAccountBalance from "./HeaderAccountBalance";
import HeaderTokenBalance from "./HeaderTokenBalance";
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
  const [globalTotal, setGlobalTotal] = useState(0);

  return (
    <ApolloProvider client={client}>
      <Router>
        <main className="main">
          <SidebarActivation />
          <Sidebar />
          <Header address={address} connectWeb3={connectWeb3} />
          <Switch>
            <Route path="/account">
              <HeaderAccountBalance globalTotal={globalTotal} />
            </Route>
            <Route
              path="/dashboard/:id"
              render={(routeProps) => <HeaderTokenBalance {...routeProps} />}
            />
            <Route path="/">
              <HeaderBalance />
            </Route>
          </Switch>
          <Switch>
            <Route exact path="/">
              <Index connectWeb3={connectWeb3} />
            </Route>
            <Route path="/dashboard">
              <Dashboard web3Global={web3Global} address={address} />
            </Route>
            <Route path="/account">
              <Account
                address={address}
                web3Global={web3Global}
                connectWeb3={connectWeb3}
                setGlobalTotal={setGlobalTotal}
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
