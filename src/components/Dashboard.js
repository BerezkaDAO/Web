import React from "react";
import { Switch, Route, Redirect, NavLink } from "react-router-dom";
import TokenDashboard from "./TokenDashboard";

function Dashboard(props) {
  const { web3Global } = props;

  return (
    <div className="page dashboard">
      <section className="section">
        <div className="section__header">
          <h1 className="title">Dashboard</h1>
        </div>
        <div className="section__breadcrumbs">
          <div className="breadcrumbs">
            <NavLink className="breadcrumbs__item" to="/dashboard/flex">
              Berezka Flex
            </NavLink>
            <NavLink className="breadcrumbs__item" to="/dashboard/emiflex">
              Emiflex
            </NavLink>
            <NavLink className="breadcrumbs__item" to="/dashboard/dyna">
              Dynamic
            </NavLink>
            <NavLink className="breadcrumbs__item" to="/dashboard/deposit">
              Deposit
            </NavLink>
          </div>
        </div>
        <Switch>
          <Route
            path="/dashboard/:id"
            render={(routeProps) => (
              <TokenDashboard web3Global={web3Global} {...routeProps} />
            )}
          />
          <Redirect from="/dashboard" to="/dashboard/flex" />
        </Switch>
      </section>
    </div>
  );
}

export default Dashboard;
