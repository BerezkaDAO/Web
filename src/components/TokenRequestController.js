import React, { useState, useEffect } from "react";
import { tokenInfo, currencyInfo } from "./data/tokens";
import { useTokenData } from "./widgets/useTokenData";
import { round } from "./widgets/round";
import { oracle } from "./widgets/oracle";
import { useLocalStorage } from "./widgets/useLocalStorage";
import { useInterval } from "./widgets/useInterval";

const WITHDRAW_CONTRACT = "0xcb947e889f7dda1df9d1fa5932ebfeee99bc893b";
const TOKEN_REQUST_MIN_AMOUNT = 3000;
const WITHDRAW_ABI = [
  {
    inputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_amountToWithdraw",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_tokenToWithraw",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "_withdrawTo",
        type: "address",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_queryId",
        type: "bytes32",
      },
    ],
    name: "WithdrawRequestCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "bytes32",
        name: "_queryId",
        type: "bytes32",
      },
    ],
    name: "WithdrawRequestFailed",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "_finalPrice",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "bytes32",
        name: "_queryId",
        type: "bytes32",
      },
    ],
    name: "WithdrawRequestSucceeded",
    type: "event",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "_queryID",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_result",
        type: "string",
      },
    ],
    name: "__callback",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "_myid",
        type: "bytes32",
      },
      {
        internalType: "string",
        name: "_result",
        type: "string",
      },
      {
        internalType: "bytes",
        name: "_proof",
        type: "bytes",
      },
    ],
    name: "__callback",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_tokens",
        type: "address",
      },
      {
        internalType: "address",
        name: "_agent",
        type: "address",
      },
    ],
    name: "addDao",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address[]",
        name: "_whitelisted",
        type: "address[]",
      },
    ],
    name: "addWhitelistTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "bytes32",
        name: "_queryId",
        type: "bytes32",
      },
    ],
    name: "cancel",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "cancel",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_price",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_targetToken",
        type: "address",
      },
    ],
    name: "computeExchange",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "daoConfig",
    outputs: [
      {
        internalType: "address",
        name: "agent",
        type: "address",
      },
      {
        internalType: "address",
        name: "tokens",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
    ],
    name: "deleteDao",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "gasprice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "lastExchangePrice",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "oracleAddress",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "oracleCallbackGas",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "owner",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "pendingQueries",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    name: "pendingRequests",
    outputs: [
      {
        internalType: "bytes32",
        name: "requestId",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "token",
        type: "address",
      },
      {
        internalType: "address",
        name: "targetToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "lastValidBlock",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address[]",
        name: "_whitelisted",
        type: "address[]",
      },
    ],
    name: "removeWhitelistTokens",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "requestValidityDurationBlocks",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "string",
        name: "_oracleAddres",
        type: "string",
      },
    ],
    name: "setOracleAddress",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_oracleCallbackGas",
        type: "uint256",
      },
    ],
    name: "setOracleGas",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_duration",
        type: "uint256",
      },
    ],
    name: "setRequestDuration",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "transferOwnership",
    outputs: [],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    constant: true,
    inputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
    ],
    name: "whitelist",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
  {
    constant: false,
    inputs: [
      {
        internalType: "uint256",
        name: "_amount",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "_token",
        type: "address",
      },
      {
        internalType: "address",
        name: "_targetToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_optimisticPrice",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [],
    payable: true,
    stateMutability: "payable",
    type: "function",
  },
];

const DAO_ABI = [
  {
    inputs: [
      {
        internalType: "address",
        name: "_depositToken",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "_depositAmount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_requestAmount",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "_reference",
        type: "string",
      },
    ],
    name: "createTokenRequest",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [{ name: "allowance", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

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
  const [pendingWithdraw, setPendingWithdraw] = useState(false);
  const [withdrawAccount, setWithdrawAccount] = useLocalStorage(
    "withdraw_account",
    null
  );
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

  useInterval(
    async () => {
      if (withdrawAccount) {
        console.log(`Got withdraw account ${withdrawAccount}`);
        const withdrawContractR0 = new web3Global.eth.Contract(
          WITHDRAW_ABI,
          WITHDRAW_CONTRACT
        );

        const result = await withdrawContractR0.methods
          .pendingQueries(withdrawAccount)
          .call();

        console.log(`Result ${result}`);

        if (
          "" + result !==
          "0x0000000000000000000000000000000000000000000000000000000000000000"
        ) {
          setPendingWithdraw(true);
        } else {
          setPendingWithdraw(false);
        }
      }
    },
    5000,
    [withdrawAccount]
  );

  const canPerformTokenRequest =
    requestedToken &&
    requestedAmount > 0 &&
    offeredToken &&
    offeredAmount > 0 &&
    !loading;

  const canPerformTokenWithdraw = canPerformTokenRequest && !pendingWithdraw;
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
    const isDexEnabled = tokenInfo[requestedToken].isDexEnabled;

    // Check for small sum first
    //
    if (isDexEnabled && offeredAmount < TOKEN_REQUST_MIN_AMOUNT) {
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

  const doPerformTokenWithdraw = async () => {
    const [web3, address] = await connectWeb3();

    if (web3 && address && canPerformTokenWithdraw) {
      const BN = web3.utils.BN;
      const requestedAmountDecimals = new BN(requestedAmount).mul(
        new BN(10).pow(new BN(18))
      );
      const offeredAmountDecimals = new BN(offeredAmount).mul(
        new BN(10).pow(new BN(currencyInfo[offeredToken].decimals))
      );

      const offeredTokenAddress = currencyInfo[offeredToken].address;
      const requestedTokenAddress = tokenInfo[requestedToken].address;
      const agentAddress = tokenInfo[requestedToken].withdrawAgent;
      const requestedTokenSymbol = tokenInfo[requestedToken].symbol;
      const offeredTokenSymbol = currencyInfo[offeredToken].symbol;

      if (offeredToken !== "dai") {
        setErrorMessage("At the moment, only DAI withdrawal is allowed");
        return;
      }

      // Check eth balance and offered token balance
      //
      const ethBalance = await web3.eth.getBalance(address);
      if (ethBalance <= 0) {
        setErrorMessage("Not enough ETH to pay transaction fees");
        return;
      }

      const requestedTokenContract = new web3Global.eth.Contract(
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
        setErrorMessage(`Not enough ${requestedTokenSymbol} on balance`);
        return;
      }

      const offeredTokenContract = new web3Global.eth.Contract(
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
        return;
      }

      // GET AND CHECK ACTUAL PRICE FROM ORACLE SCRIPT
      //
      const optimisticPrice = await oracle(requestedTokenAddress);
      if (!optimisticPrice) {
        setErrorMessage(
          `It is impossible to make a withdrawal due to high volatility (This is when the price of Dex differs greatly from ours)`
        );
        return;
      }
      console.log(`Got optimistic price: ${optimisticPrice}`);
      // -----

      const withdrawContract = new web3.eth.Contract(
        WITHDRAW_ABI,
        WITHDRAW_CONTRACT
      );

      // Determine Eth Amount for oracle callback
      //
      const gasPriceBNString = await web3.eth.getGasPrice();
      const getPrice = new BN(gasPriceBNString);
      const callbackGasBNString = await withdrawContract.methods
        .oracleCallbackGas()
        .call();
      const callbackGas = new BN(callbackGasBNString);
      const oracleFee = new BN(10000);
      const totalEthToCall = getPrice.mul(callbackGas.add(oracleFee));

      // Call withdraw
      //
      await withdrawContract.methods
        .withdraw(
          requestedAmountDecimals.toString(),
          requestedTokenAddress,
          offeredTokenAddress,
          optimisticPrice.toString()
        )
        .send({
          from: address,
          gasPrice: getPrice,
          value: totalEthToCall,
        });

      setPendingWithdraw(true);
      setWithdrawAccount(address);
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
