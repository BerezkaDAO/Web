import React from "react";
import TokenTableInfo from "./widgets/TokenTableInfo";
import { allTokens } from "./data/tokens";

function Account(props) {
  const { web3Global, address, connectWeb3, setGlobalTotal } = props;

  return (
    <div className="page account">
      <section className="section">
        <div className="section__header">
          <h1 className="title">My Account</h1>
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
              walletAddress={"0x108977FE1Cfd10f27D9591C33b8FE9733FD83D2C"}
              web3={web3Global}
              setGlobalTotal={setGlobalTotal}
              profitAccumulator={() => {}}
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default Account;
