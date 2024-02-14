import React, { useState, useEffect, useMemo } from "react";
import { tokenInfo, currencyInfo } from "./data/tokens";
import { useTokenData } from "./widgets/useTokenData";
import { round } from "./widgets/round";
import { oracle } from "./widgets/oracle";
import WITHDRAW_ABI from "./abi/Withdraw";
import DEPOSIT_ABI from "./abi/Deposit";
import DAO_ABI from "./abi/Dao";
import ERC20_ABI from "./abi/ERC20";
import { fireNotification } from "./widgets/notification";
import { observer } from "mobx-react-lite";
import { userStore } from "./domen/userStore";
import { fetchExchangeRate } from "./services/daos";
import Web3 from "web3";

// const WITHDRAW_CONTRACT_TESTNET = " ";
const WITHDRAW_CONTRACT = "0xCe90D38B084Aad57bc26C5C66F377d6DF7882846";
// const DEPOSIT_CONTRACT_TESTNET = "0x5E1d4cA33609681e46D7b1b81DF9e0C58fc8aBB4";
const DEPOSIT_CONTRACT = "0xFb60632ec2508f7576843aca031ff6b4ecBC1Ab4";
const TOKEN_REQUST_MIN_AMOUNT = 2900;

// const RINKEBY_TETSTNET_DAI_TOKEN = "0xc7ad46e0b8a400bb3c915120d284aafba8fc4735";
// const RINKEBY_TETSTNET_USDT_TOKEN =
//   "0x9365a9d59fEfe5A6387F0aec87847E39a9B6DAB1";

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
  const { dao, connectWeb3, Component } = props;
  const { walletAddress } = userStore;
  const { id: daoId, withdraw_enabled: withdrawEnabled } = dao;
  const acceptableTokensSymbols = dao.dao_acceptable_tokens.map(
    (token) => token.token.symbol
  );

  const [requestedToken, setRequestedToken] = useState(daoId);
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [offeredAmount, setOfferedAmount] = useState(0);
  const [offeredToken, setOfferedToken] = useState(acceptableTokensSymbols[0]);
  const [errorMessage, setErrorMessage] = useState();
  const [smallSum, setSmallSum] = useState(false);
  const { loading, merged } = useTokenData(dao.token.contract, false);

  useEffect(() => {
    if (
      (offeredAmount && offeredAmount >= TOKEN_REQUST_MIN_AMOUNT) ||
      offeredAmount === 0
    ) {
      setSmallSum(false);
    }
  }, [offeredAmount]);

  const getTokenContracts = (requestToken, offerToken) => {
    const requestContract = tokenInfo[requestToken].address;
    const offerContract = dao.dao_acceptable_tokens.find(
      (token) => token.token.symbol === offerToken
    ).token.contract;

    return { requestContract, offerContract };
  };

  const tokenDecimals = useMemo(() => {
    const BN = new Web3().utils.BN;

    const requestedAmountDecimals = new BN(requestedAmount * 100).mul(
      new BN(10).pow(new BN(16))
    );
    const offeredTokenDecimals = dao.dao_acceptable_tokens.find(
      (token) => token.token.symbol === offeredToken
    ).token.decimals;

    const offeredAmountDecimals = new BN(offeredAmount * 100).mul(
      new BN(10).pow(new BN(offeredTokenDecimals - 2))
    );

    return {
      requestedAmountDecimals,
      offeredAmountDecimals,
      requestedTokenDecimals: 18,
      offeredTokenDecimals,
    };
  }, [offeredToken, offeredAmount, requestedAmount, dao]);

  const canPerformTokenRequest =
    requestedToken &&
    requestedAmount > 0 &&
    offeredToken &&
    offeredAmount > 0 &&
    !loading;

  const canPerformTokenWithdraw = canPerformTokenRequest;

  const handleRequestedAmountChange = async (currentAmount) => {
    setRequestedAmount(currentAmount);

    if (currentAmount > 0) {
      const { requestContract, offerContract } = getTokenContracts(
        requestedToken,
        offeredToken
      );

      const exchange = await fetchExchangeRate({
        offeredToken: offerContract,
        requestedToken: requestContract,
        requestedAmount: currentAmount,
        callerAddress: walletAddress,
        daoId,
      });

      if (exchange.deposit_amount) {
        setOfferedAmount(round(exchange.deposit_amount, 2));
      }
    }
  };

  const doSetOfferedAmounBlastDao = (amount) => {
    var actualAmount = amount;
    setOfferedAmount(actualAmount);

    if (!loading) {
      const price = Number.parseFloat(merged[0].price) / 10 ** 6;
      setRequestedAmount(round(actualAmount / price, 4));
    }
  };

  const handleOfferedAmountChange = async (currentAmount, currentToken) => {
    setOfferedAmount(currentAmount);

    if (currentAmount > 0) {
      const { requestContract, offerContract } = getTokenContracts(
        requestedToken,
        currentToken
      );

      const exchange = await fetchExchangeRate({
        offeredToken: offerContract,
        requestedToken: requestContract,
        offeredAmount: currentAmount,
        callerAddress: walletAddress,
        daoId,
      });

      if (exchange.request_amount) {
        setRequestedAmount(round(exchange.request_amount, 4));
      }
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

    if (web3 && address) {
      const BN = web3.utils.BN;

      const { offeredAmountDecimals, requestedAmountDecimals } = tokenDecimals;

      const { offerContract: offeredTokenAddress } = getTokenContracts(
        requestedToken,
        offeredToken
      );

      // const requestedAmountDecimals = new BN(requestedAmount).mul(
      //   new BN(10).pow(new BN(18))
      // );
      // const offeredAmountDecimals = new BN(offeredAmount).mul(
      //   new BN(10).pow(new BN(currencyInfo[offeredToken].decimals))
      // );
      // let offeredTokenAddress = currencyInfo[offeredToken].address;
      const daoAddress = tokenInfo[requestedToken].dao;

      // const network_id = await web3.eth.net.getId();
      // if (network_id === 4) {
      //   // Rinkeby testnet
      //   if (offeredToken === "dai") {
      //     offeredTokenAddress = RINKEBY_TETSTNET_DAI_TOKEN;
      //   } else if (offeredToken === "usdt") {
      //     offeredTokenAddress = RINKEBY_TETSTNET_USDT_TOKEN;
      //   } else {
      //     setErrorMessage("In testnet, only DAI & USDT withdrawal is allowed");
      //     return;
      //   }
      // }

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

  const doPerformBlastDeposit = async () => {
    const [web3, address] = await connectWeb3();

    if (web3 && address && canPerformTokenRequest) {
      try {
        await web3.eth.sendTransaction({
          to: "0xa3a26A34483D325075bE577Bd2DF2A73bc94DC8A",
          from: address,
          value: web3.utils.toWei(offeredAmount, "ether"),
        });
      } catch (e) {
        console.log("Transaction failed", e);
      }
    }
  };

  const doPerformTokenRequestDirect = async () => {
    const [web3, address] = await connectWeb3();

    if (web3 && address && canPerformTokenRequest) {
      const {
        offeredAmountDecimals,
        requestedAmountDecimals,
        offeredTokenDecimals,
        requestedTokenDecimals,
      } = tokenDecimals;

      const {
        requestContract: requestedTokenAddress,
        offerContract: offeredTokenAddress,
      } = getTokenContracts(requestedToken, offeredToken);

      const BN = web3.utils.BN;
      // const offeredAmountDecimals = new BN(offeredAmount).mul(
      //   new BN(10).pow(new BN(currencyInfo[offeredToken].decimals))
      // );
      // const requestedAmountDecimals = new BN(requestedAmount * 100).mul(
      //   new BN(10).pow(new BN(16))
      // );

      const requestedTokenSymbol = tokenInfo[requestedToken].symbol;
      const offeredTokenSymbol = offeredToken;
      let agentAddress = tokenInfo[requestedToken].withdrawAgent;

      const net = await web3.eth.net.getId();
      let depositContractAddress = DEPOSIT_CONTRACT;
      // if (net === 4) {
      //   // Rinkeby testnet
      //   if (offeredToken === "dai") {
      //     offeredTokenAddress = RINKEBY_TETSTNET_DAI_TOKEN;
      //   } else if (offeredToken === "usdt") {
      //     offeredTokenAddress = RINKEBY_TETSTNET_USDT_TOKEN;
      //   } else {
      //     setErrorMessage("In testnet, only DAI & USDT withdrawal is allowed");
      //     return;
      //   }
      //   depositContractAddress = DEPOSIT_CONTRACT_TESTNET;
      // }

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

      const agentBalance = await offeredTokenContract.methods
        .balanceOf(agentAddress)
        .call();

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
          optimisticPrice.signature,
          ""
        )
        .send({
          from: address,
          gas: 500000,
          nonce: nonce,
        })
        .on("transactionHash", (hash) => {
          let network = "Ethereum [Mainnet]";
          if (net === 4) {
            network = "Rinkeby [Testnet]";
          }

          const params = {
            address: address,
            amount:
              Number.parseInt(
                requestedAmountDecimals
                  .div(new BN(10).pow(new BN(requestedTokenDecimals)))
                  .toString(10)
              ) / 100,
            token: requestedTokenSymbol.toUpperCase(),
            stable_token: offeredTokenSymbol.toUpperCase(),
            stable_amount:
              Number.parseInt(
                offeredAmountDecimals
                  .div(new BN(10).pow(new BN(offeredTokenDecimals - 2)))
                  .toString(10)
              ) / 100,
            current_stable_amount:
              Number.parseInt(
                web3.utils
                  .toBN(agentBalance)
                  .div(new BN(10).pow(new BN(offeredTokenDecimals - 2)))
                  .toString(10)
              ) / 100,
            network: network,
            tx_id: hash,
          };

          fireNotification("AGENT_FUNDS_DEPOSIT", params);
        });
    }
  };

  const doPerformTokenWithdraw = async () => {
    const [web3, address] = await connectWeb3();

    if (web3 && address && canPerformTokenWithdraw) {
      const BN = web3.utils.BN;
      // const requestedAmountDecimals = new BN(requestedAmount * 100).mul(
      //   new BN(10).pow(new BN(16))
      // );
      // const offeredAmountDecimals = new BN(offeredAmount * 100).mul(
      //   new BN(10).pow(new BN(currencyInfo[offeredToken].decimals - 2))
      // );
      const {
        offeredAmountDecimals,
        requestedAmountDecimals,
        offeredTokenDecimals,
        requestedTokenDecimals,
      } = tokenDecimals;

      const {
        requestContract: requestedTokenAddress,
        offerContract: offeredTokenAddress,
      } = getTokenContracts(requestedToken, offeredToken);

      const net = await web3.eth.net.getId();

      // let offeredTokenAddress =
      //   currencyInfo[offeredToken.toLowerCase()].address;
      // let requestedTokenAddress = tokenInfo[requestedToken].address;

      let agentAddress = tokenInfo[requestedToken].withdrawAgent;

      const requestedTokenSymbol = tokenInfo[requestedToken].symbol;
      const offeredTokenSymbol =
        currencyInfo[offeredToken.toLowerCase()].symbol;

      let withdrawContractAddress = WITHDRAW_CONTRACT;

      // if (net === 4) {
      //   // Rinkeby testnet
      //   if (offeredToken === "dai") {
      //     offeredTokenAddress = RINKEBY_TETSTNET_DAI_TOKEN;
      //   } else if (offeredToken === "usdt") {
      //     offeredTokenAddress = RINKEBY_TETSTNET_USDT_TOKEN;
      //   } else {
      //     setErrorMessage("In testnet, only DAI & USDT withdrawal is allowed");
      //     return;
      //   }
      //   withdrawContractAddress = WITHDRAW_CONTRACT_TESTNET;
      // }

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
        const network = "Ethereum [Mainnet]";
        // if (net === 4) {
        //   network = "Rinkeby [Testnet]";
        // }
        const params = {
          address: address,
          amount:
            Number.parseInt(
              requestedAmountDecimals
                .div(new BN(10).pow(new BN(requestedTokenDecimals - 2)))
                .toString(10)
            ) / 100,
          token: requestedTokenSymbol.toUpperCase(),
          stable_token: offeredTokenSymbol.toUpperCase(),
          stable_amount:
            Number.parseInt(
              offeredAmountDecimals
                .div(new BN(10).pow(new BN(offeredTokenDecimals - 2)))
                .toString(10)
            ) / 100,
          current_stable_amount:
            Number.parseInt(
              web3.utils
                .toBN(agentBalance)
                .div(new BN(10).pow(new BN(offeredTokenDecimals - 2)))
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
            network = "Rinkeby [Testnet]";
          }

          const params = {
            address: address,
            amount:
              Number.parseInt(
                requestedAmountDecimals
                  .div(new BN(10).pow(new BN(requestedTokenDecimals)))
                  .toString(10)
              ) / 100,
            token: requestedTokenSymbol.toUpperCase(),
            stable_token: offeredTokenSymbol.toUpperCase(),
            stable_amount:
              Number.parseInt(
                offeredAmountDecimals
                  .div(new BN(10).pow(new BN(offeredTokenDecimals - 2)))
                  .toString(10)
              ) / 100,
            current_stable_amount:
              Number.parseInt(
                web3.utils
                  .toBN(agentBalance)
                  .div(new BN(10).pow(new BN(offeredTokenDecimals - 2)))
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
      setRequestedAmount={handleRequestedAmountChange}
      setOfferedAmount={handleOfferedAmountChange}
      offeredToken={offeredToken}
      requestedAmount={requestedAmount}
      offeredAmount={offeredAmount}
      requestedToken={requestedToken}
      performTokenRequest={doPerformTokenRequest}
      performTokenWithdraw={doPerformTokenWithdraw}
      canPerformTokenRequest={canPerformTokenRequest}
      canPerformTokenWithdraw={canPerformTokenWithdraw}
      performBlastDeposit={doPerformBlastDeposit}
      withdrawEnabled={withdrawEnabled}
      errorMessage={errorMessage}
      smallSum={smallSum}
      setOfferedAmountBlastDao={doSetOfferedAmounBlastDao}
      acceptableTokens={acceptableTokensSymbols}
    />
  );
}

export default observer(TokenRequestController);
