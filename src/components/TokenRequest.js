import React from "react";
import { NavLink } from "react-router-dom";
import TokenRequestController from "./TokenRequestController";
import TokenRequestStandalone from "./TokenRequestStandalone";

function TokenRequest(props) {
  const { connectWeb3 } = props;

  return (
    <div className="token-request">
      <section className="section">
        <div className="section__header">
          <h1 className="title">Token request</h1>
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
        <TokenRequestController
          initialToken={"flex"}
          initialCurrency={"usdt"}
          connectWeb3={connectWeb3}
          Component={TokenRequestStandalone}
        />
      </section>
    </div>
  );
}

export default TokenRequest;
