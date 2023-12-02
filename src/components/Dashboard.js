import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import TokenDashboard from "./TokenDashboard";
import TokenDashboardNavigation from "./TokenDashboardNavigation";
import { defaultToken } from "./data/tokens";
import { checkIsBlastDao } from "./widgets/checkIsBlastDao";
import { TokenDashboardBlastDao } from "./TokenDashboardBlastDao";

function Dashboard(props) {
  const { web3Global, address } = props;

  return (
    <div className="page dashboard">
      <section className="section">
        <div className="section__header">
          <h1 className="title">Dashboard</h1>
        </div>
        <div className="section__breadcrumbs">
          <TokenDashboardNavigation />
        </div>
        <Switch>
          <Route
            path="/dashboard/:id"
            render={(routeProps) => {
              const isBlastDao = checkIsBlastDao(routeProps.match.params.id);

              return isBlastDao ? (
                <TokenDashboardBlastDao
                  web3Global={web3Global}
                  address={address}
                  {...routeProps}
                />
              ) : (
                <TokenDashboard
                  web3Global={web3Global}
                  address={address}
                  {...routeProps}
                />
              );
            }}
          />
          <Redirect from="/dashboard" to={`/dashboard/${defaultToken[0]}`} />
        </Switch>
      </section>
    </div>
  );
}

export default Dashboard;
