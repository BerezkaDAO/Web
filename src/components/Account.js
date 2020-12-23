import React from "react";
import { NavLink } from "react-router-dom";
import TokenTableInfo from "./widgets/TokenTableInfo";
import { allTokens } from "./data/tokens";

function Account(props) {
  const { web3Global, address, connectWeb3 } = props;

  return (
    <div className="account">
      <section className="section">
        <div className="section__header">
          <h1 className="title">My Account</h1>
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
        {!address ? (
          <div className="buttons">
            <a className="button _light" href onClick={connectWeb3}>
              Connect wallet
            </a>
          </div>
        ) : (
          <div className="table-wrapper">
            <TokenTableInfo
              tokens={allTokens}
              walletAddress={address}
              web3={web3Global}
              profitAccumulator={() => {}}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Account;
