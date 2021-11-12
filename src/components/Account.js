import React, { useState, useEffect } from "react";
import TokenTableInfo from "./widgets/TokenTableInfo";
import { fetchTokensFull } from "./widgets/daoes";

function Account(props) {
  const { web3Global, address, connectWeb3, setGlobalTotal } = props;
  const [tokens, setTokens] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    const fn = async () => {
      const daoTokens = await fetchTokensFull();
      if (!isCancelled) {
        setTokens(daoTokens);
      }
    };
    fn();

    return () => {
      isCancelled = true;
    };
  }, []);

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
              tokens={tokens}
              walletAddress={address}
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
