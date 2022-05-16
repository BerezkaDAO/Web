import React, { useState, useEffect } from "react";
import { tokenInfo, currencyInfo } from "./data/tokens";
import { useTokenData } from "./widgets/useTokenData";
import { round } from "./widgets/round";
import { oracle } from "./widgets/oracle";
import WITHDRAW_ABI from "./abi/Withdraw";
import DEPOSIT_ABI from "./abi/Deposit";
import DAO_ABI from "./abi/Dao";
import ERC20_ABI from "./abi/ERC20";
import { fireNotification } from "./widgets/notification";

const WITHDRAW_CONTRACT_TESTNET = "0xe282295a28482e937b0d1cf45af91fb484a2f490";
const WITHDRAW_CONTRACT = "0xCe90D38B084Aad57bc26C5C66F377d6DF7882846";
const DEPOSIT_CONTRACT_TESTNET = "0xdC3bde4E1b587Ba0c4B0E6dF8ad800c273fB08DB";
const DEPOSIT_CONTRACT = "0xdC3bde4E1b587Ba0c4B0E6dF8ad800c273fB08DB";
const TOKEN_REQUST_MIN_AMOUNT = 2900;

const ROPSTEN_TESTNET_DAO_TOKEN = "0xa579b0ee7f64ea4da01bf43ab173a597d9bb7bd4";
const ROPSTEN_TETSTNET_DAI_TOKEN = "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735";
const ROPSTEN_TETSTNET_USDT_TOKEN =
  "0xd92e713d051c37ebb2561803a3b5fbabc4962431";

function toBigNumberString(num) {
  return ("" + +num).replace(
    /(-?)(\d*)\.?(\d+)e([+-]\d+)/,
    function (a, b, c, d, e) {
      return e < 0
        ? b + "0." + Array(1 - e - c.length).join(0) + c + d
        : b + c + d + Array(e - d.length + 1).join(0);
    }
  );
}

function TokenRequestController(props) {
  const {
    initialToken,
    initialCurrency,
    connectWeb3,
    web3Global,
    Component,
  } = props;

  const [requestedToken, setRequestedToken] = useState(initialToken);
  const [offeredToken, setOfferedToken] = useState(initialCurrency);
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [offeredAmount, setOfferedAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState();
  const [smallSum, setSmallSum] = useState(false);
  const { loading, merged } = useTokenData(
    tokenInfo[requestedToken].address,
    false
  );

  useEffect(() => {
    if (!loading) {
      doSetRequestedAmount(requestedAmount);
    }
  }, [loading, requestedToken]);

  useEffect(() => {
    if (
      (offeredAmount && offeredAmount >= TOKEN_REQUST_MIN_AMOUNT) ||
      offeredAmount === 0
    ) {
      setSmallSum(false);
    }
  }, [offeredAmount]);

  const canPerformTokenRequest =
    requestedToken &&
    requestedAmount > 0 &&
    offeredToken &&
    offeredAmount > 0 &&
    !loading;

  const canPerformTokenWithdraw = canPerformTokenRequest;
  const withdrawEnabled = tokenInfo[requestedToken].withdrawEnabled;

  const doSetRequestedAmount = (amount) => {
    const actualAmount = amount || 0;
    setRequestedAmount(actualAmount);
    if (!loading) {
      const price =
        Number.parseFloat(merged[0].priceAfterCarry || merged[0].price) /
        10 ** 6;
      setOfferedAmount(round(actualAmount * price, 2));
    }
  };

  const doSetOfferedAmount = (amount) => {
    var actualAmount = amount || 0;
    setOfferedAmount(actualAmount);
    if (!loading) {
      const price =
        Number.parseFloat(merged[0].priceAfterCarry || merged[0].price) /
        10 ** 6;
      setRequestedAmount(round(actualAmount / price, 2));
    }
  };

  const doPerformTokenRequest = async () => {
    const depositEnabled = tokenInfo[requestedToken].depositEnabled;
    if (depositEnabled) {
      await doPerformTokenRequestDirect();
    } else {
      await doPerformTokenRequestDao();
    }
  };

  const doPerformTokenRequestDao = async () => {
    //const isDexEnabled = tokenInfo[requestedToken].isDexEnabled;
    const minDepositAmount =
      tokenInfo[requestedToken].minDepositAmount || TOKEN_REQUST_MIN_AMOUNT;

    // Check for small sum first
    //
    if (/*isDexEnabled && */ offeredAmount < minDepositAmount) {
      setSmallSum(true);
      return;
    }

    const [web3, address] = await connectWeb3();

    if (web3 && address && canPerformTokenRequest) {
      const BN = web3.utils.BN;
      const requestedAmountDecimals = new BN(requestedAmount).mul(
        new BN(10).pow(new BN(18))
      );
      const offeredAmountDecimals = new BN(offeredAmount).mul(
        new BN(10).pow(new BN(currencyInfo[offeredToken].decimals))
      );
      const offeredTokenAddress = currencyInfo[offeredToken].address;
      const daoAddress = tokenInfo[requestedToken].dao;

      // Check eth balance and offered token balance
      //
      const ethBalance = await web3.eth.getBalance(address);
      if (ethBalance <= 0) {
        setErrorMessage("Not enough ETH to pay transaction fees");
        return;
      }

      const offeredTokenContract = new web3.eth.Contract(
        ERC20_ABI,
        offeredTokenAddress
      );
      const offeredTokenContractRO = new web3Global.eth.Contract(
        ERC20_ABI,
        offeredTokenAddress
      );

      const balance = await offeredTokenContractRO.methods
        .balanceOf(address)
        .call();
      const balanceFloat = Number.parseFloat(balance);
      if (!balanceFloat || web3.utils.toBN(balance).lt(offeredAmountDecimals)) {
        setErrorMessage("Not enough USDT / USDC / DAI on balance");
        return;
      }
      let nonce = await web3.eth.getTransactionCount(address);
      // Check allowance
      //
      const allowance = await offeredTokenContractRO.methods
        .allowance(address, daoAddress)
        .call();
      const allowanceFloat = Number.parseFloat(allowance);
      if (
        !allowanceFloat ||
        web3.utils.toBN(allowance).lt(offeredAmountDecimals)
      ) {
        // If allowance != 0 and token is USDT reset approval first,
        // otherwise transaction will fail
        //
        if (allowanceFloat && allowanceFloat > 0 && offeredToken === "usdt") {
          offeredTokenContract.methods
            .approve(daoAddress, toBigNumberString("0"))
            .send({
              from: address,
              nonce: nonce,
            });
          nonce++;
        }
        // Require approval first
        //
        offeredTokenContract.methods
          .approve(daoAddress, new BN(10).pow(new BN(28)))
          .send({
            from: address,
            nonce: nonce,
          });
        nonce++;
      }
      const daoContract = new web3.eth.Contract(DAO_ABI, daoAddress);
      await daoContract.methods
        .createTokenRequest(
          offeredTokenAddress,
          offeredAmountDecimals.toString(),
          requestedAmountDecimals.toString(),
          ""
        )
        .send({
          from: address,
          gas: 500000,
          nonce: nonce,
        });
      nonce++;
    }
  };

  const doPerformTokenRequestDirect = async () => {
    //const isDexEnabled = tokenInfo[requestedToken].isDexEnabled;
    const minDepositAmount = 0;

    // Check for small sum first
    //
    if (/*isDexEnabled && */ offeredAmount < minDepositAmount) {
      setSmallSum(true);
      return;
    }

    const [web3, address] = await connectWeb3();

    if (web3 && address && canPerformTokenRequest) {
      const BN = web3.utils.BN;
      const offeredAmountDecimals = new BN(offeredAmount).mul(
        new BN(10).pow(new BN(currencyInfo[offeredToken].decimals))
      );
      const requestedAmountDecimals = new BN(requestedAmount * 100).mul(
        new BN(10).pow(new BN(16))
      );
      let requestedTokenAddress = tokenInfo[requestedToken].address;
      let offeredTokenAddress = currencyInfo[offeredToken].address;

      const net = await web3.eth.net.getId();
      let depositContractAddress = DEPOSIT_CONTRACT;
      if (net === 4) {
        // Ropsten testnet
        requestedTokenAddress = ROPSTEN_TESTNET_DAO_TOKEN;
        if (offeredToken === "dai") {
          offeredTokenAddress = ROPSTEN_TETSTNET_DAI_TOKEN;
        } else if (offeredToken === "usdt") {
          offeredTokenAddress = ROPSTEN_TETSTNET_USDT_TOKEN;
        } else {
          setErrorMessage("In testnet, only DAI & USDT withdrawal is allowed");
          return;
        }
        depositContractAddress = DEPOSIT_CONTRACT_TESTNET;
      }

      // Check eth balance and offered token balance
      //
      const ethBalance = await web3.eth.getBalance(address);
      if (ethBalance <= 0) {
        setErrorMessage("Not enough ETH to pay transaction fees");
        return;
      }

      let er20abi = ERC20_ABI;
      const offeredTokenContract = new web3.eth.Contract(
        er20abi,
        offeredTokenAddress
      );

      const balance = await offeredTokenContract.methods
        .balanceOf(address)
        .call();
      const balanceFloat = Number.parseFloat(balance);
      if (!balanceFloat || web3.utils.toBN(balance).lt(offeredAmountDecimals)) {
        setErrorMessage("Not enough USDT / USDC / DAI on balance");
        return;
      }
      let nonce = await web3.eth.getTransactionCount(address);
      // Check allowance
      //
      const allowance = await offeredTokenContract.methods
        .allowance(address, depositContractAddress)
        .call();
      const allowanceFloat = Number.parseFloat(allowance);
      if (
        !allowanceFloat ||
        web3.utils.toBN(allowance).lt(offeredAmountDecimals)
      ) {
        // If allowance != 0 and token is USDT reset approval first,
        // otherwise transaction will fail
        //
        if (allowanceFloat && allowanceFloat > 0 && offeredToken === "usdt") {
          offeredTokenContract.methods
            .approve(depositContractAddress, toBigNumberString("0"))
            .send({
              from: address,
              nonce: nonce,
            });
          nonce++;
        }
        // Require approval first
        //
        offeredTokenContract.methods
          .approve(depositContractAddress, new BN(10).pow(new BN(28)))
          .send({
            from: address,
            nonce: nonce,
          });
        nonce++;
      }

      // GET AND CHECK ACTUAL PRICE FROM ORACLE SCRIPT
      //
      const optimisticPrice = await oracle(requestedTokenAddress);
      if (!optimisticPrice || !optimisticPrice.price) {
        setErrorMessage(
          `It is impossible to make a deposit due to undefined price`
        );
        return;
      }
      console.log(`Got optimistic price: ${optimisticPrice.price}`);
      // -----

      const depositContract = new web3.eth.Contract(
        DEPOSIT_ABI,
        depositContractAddress
      );
      await depositContract.methods
        .deposit(
          requestedAmountDecimals.toString(),
          requestedTokenAddress,
          offeredTokenAddress,
          optimisticPrice.price,
          optimisticPrice.ts,
          optimisticPrice.signature
        )
        .send({
          from: address,
          gas: 500000,
          nonce: nonce,
        });
      nonce++;
    }
  };

  const doPerformTokenWithdraw = async () => {
    const [web3, address] = await connectWeb3();

    if (web3 && address && canPerformTokenWithdraw) {
      const BN = web3.utils.BN;
      const requestedAmountDecimals = new BN(requestedAmount * 100).mul(
        new BN(10).pow(new BN(16))
      );
      const offeredAmountDecimals = new BN(offeredAmount * 100).mul(
        new BN(10).pow(new BN(currencyInfo[offeredToken].decimals - 2))
      );

      const net = await web3.eth.net.getId();

      let offeredTokenAddress = currencyInfo[offeredToken].address;
      let requestedTokenAddress = tokenInfo[requestedToken].address;
      let agentAddress = tokenInfo[requestedToken].withdrawAgent;
      const requestedTokenSymbol = tokenInfo[requestedToken].symbol;
      const offeredTokenSymbol = currencyInfo[offeredToken].symbol;
      let withdrawContractAddress = WITHDRAW_CONTRACT;
      if (net === 4) {
        // Ropsten testnet
        requestedTokenAddress = ROPSTEN_TESTNET_DAO_TOKEN;
        if (offeredToken === "dai") {
          offeredTokenAddress = ROPSTEN_TETSTNET_DAI_TOKEN;
        } else if (offeredToken === "usdt") {
          offeredTokenAddress = ROPSTEN_TETSTNET_USDT_TOKEN;
        } else {
          setErrorMessage("In testnet, only DAI & USDT withdrawal is allowed");
          return;
        }
        agentAddress = tokenInfo[requestedToken].testWithdrawAgent;
        withdrawContractAddress = WITHDRAW_CONTRACT_TESTNET;
      }

      // Check eth balance and offered token balance
      //
      const ethBalance = await web3.eth.getBalance(address);
      if (ethBalance <= 0) {
        setErrorMessage("Not enough ETH to pay transaction fees");
        return;
      }

      const requestedTokenContract = new web3.eth.Contract(
        ERC20_ABI,
        requestedTokenAddress
      );

      // Check balance of requested token
      //
      const balance = await requestedTokenContract.methods
        .balanceOf(address)
        .call();
      const balanceFloat = Number.parseFloat(balance);
      if (
        !balanceFloat ||
        web3.utils.toBN(balance).lt(requestedAmountDecimals)
      ) {
        setErrorMessage(
          `Not enough ${requestedTokenSymbol} on balance. Your request has been sent to DAO, try again later`
        );
        return;
      }

      const offeredTokenContract = new web3.eth.Contract(
        ERC20_ABI,
        offeredTokenAddress
      );

      // Check balance of offered token on agent
      //
      const agentBalance = await offeredTokenContract.methods
        .balanceOf(agentAddress)
        .call();
      const agentBalanceFloat = Number.parseFloat(agentBalance);
      if (
        !agentBalanceFloat ||
        web3.utils.toBN(agentBalance).lt(offeredAmountDecimals)
      ) {
        setErrorMessage(`Not enough ${offeredTokenSymbol} on agent balance`);
        let network = "Ethereum [Mainnet]";
        if (net === 4) {
          network = "Ropsten [Testnet]";
        }
        const params = {
          address: address,
          amount:
            Number.parseInt(
              requestedAmountDecimals
                .div(new BN(10).pow(new BN(16)))
                .toString(10)
            ) / 100,
          token: requestedTokenSymbol.toUpperCase(),
          stable_token: offeredTokenSymbol.toUpperCase(),
          stable_amount:
            Number.parseInt(
              offeredAmountDecimals
                .div(
                  new BN(10).pow(
                    new BN(currencyInfo[offeredToken].decimals - 2)
                  )
                )
                .toString(10)
            ) / 100,
          current_stable_amount:
            Number.parseInt(
              web3.utils
                .toBN(agentBalance)
                .div(
                  new BN(10).pow(
                    new BN(currencyInfo[offeredToken].decimals - 2)
                  )
                )
                .toString(10)
            ) / 100,
          network: network,
        };
        fireNotification("AGENT_FUNDS_REQUEST", params);
        return;
      }

      // GET AND CHECK ACTUAL PRICE FROM ORACLE SCRIPT
      //
      const optimisticPrice = await oracle(requestedTokenAddress);
      if (!optimisticPrice || !optimisticPrice.price) {
        setErrorMessage(
          `It is impossible to make a withdrawal due to undefined price`
        );
        return;
      }
      console.log(`Got optimistic price: ${optimisticPrice.price}`);
      // -----

      const withdrawContract = new web3.eth.Contract(
        WITHDRAW_ABI,
        withdrawContractAddress
      );

      setErrorMessage(null);

      // Call withdraw
      //
      withdrawContract.methods
        .withdraw(
          requestedAmountDecimals.toString(),
          requestedTokenAddress,
          offeredTokenAddress,
          optimisticPrice.price,
          optimisticPrice.ts,
          optimisticPrice.signature
        )
        .send({
          from: address,
        })
        .on("transactionHash", (hash) => {
          let network = "Ethereum [Mainnet]";
          if (net === 4) {
            network = "Ropsten [Testnet]";
          }

          const params = {
            address: address,
            amount:
              Number.parseInt(
                requestedAmountDecimals
                  .div(new BN(10).pow(new BN(16)))
                  .toString(10)
              ) / 100,
            token: requestedTokenSymbol.toUpperCase(),
            stable_token: offeredTokenSymbol.toUpperCase(),
            stable_amount:
              Number.parseInt(
                offeredAmountDecimals
                  .div(
                    new BN(10).pow(
                      new BN(currencyInfo[offeredToken].decimals - 2)
                    )
                  )
                  .toString(10)
              ) / 100,
            current_stable_amount:
              Number.parseInt(
                web3.utils
                  .toBN(agentBalance)
                  .div(
                    new BN(10).pow(
                      new BN(currencyInfo[offeredToken].decimals - 2)
                    )
                  )
                  .toString(10)
              ) / 100,
            network: network,
            tx_id: hash,
          };

          fireNotification("AGENT_FUNDS_WITHDRAWN", params);
        });
    }
  };

  return (
    <Component
      setRequestedToken={setRequestedToken}
      setOfferedToken={setOfferedToken}
      setRequestedAmount={doSetRequestedAmount}
      setOfferedAmount={doSetOfferedAmount}
      offeredToken={offeredToken}
      requestedAmount={requestedAmount}
      offeredAmount={offeredAmount}
      requestedToken={requestedToken}
      performTokenRequest={doPerformTokenRequest}
      performTokenWithdraw={doPerformTokenWithdraw}
      canPerformTokenRequest={canPerformTokenRequest}
      canPerformTokenWithdraw={canPerformTokenWithdraw}
      withdrawEnabled={withdrawEnabled}
      errorMessage={errorMessage}
      smallSum={smallSum}
    />
  );
}

export default TokenRequestController;
