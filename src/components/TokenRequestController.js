import React, { useState, useEffect } from "react";
import { tokenInfo, currencyInfo } from "./data/tokens";
import { useTokenData } from "./widgets/useTokenData";
import { round } from "./widgets/round";

const TOKEN_REQUST_MIN_AMOUNT = 0;
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
    if (offeredAmount && offeredAmount >= TOKEN_REQUST_MIN_AMOUNT) {
      setSmallSum(false);
    }
  }, [offeredAmount]);

  const canPerformTokenRequest =
    requestedToken &&
    requestedAmount > 0 &&
    offeredToken &&
    offeredAmount > 0 &&
    !loading;

  const doSetRequestedAmount = (amount) => {
    const actualAmount = amount || 0;
    setRequestedAmount(actualAmount);
    if (!loading) {
      const price = Number.parseFloat(merged[0].price) / 10 ** 6;
      setOfferedAmount(round(actualAmount * price, 2));
    }
  };

  const doSetOfferedAmount = (amount) => {
    var actualAmount = amount || 0;
    setOfferedAmount(actualAmount);
    if (!loading) {
      const price = Number.parseFloat(merged[0].price) / 10 ** 6;
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
      canPerformTokenRequest={canPerformTokenRequest}
      errorMessage={errorMessage}
      smallSum={smallSum}
    />
  );
}

export default TokenRequestController;
