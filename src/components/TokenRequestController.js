import React, { useState, useEffect } from "react";
import { tokenInfo, currencyInfo } from "./data/tokens";
import { round } from "./widgets/round";
import { useQuery, gql } from "@apollo/react-hooks";

const GET_LAST_PRICE = `
query GetLastHourPrice ($tokenAddress: String){
    hourHistoricalDatas(
      orderBy: hourId, 
      orderDirection:desc,
      where: { token: $tokenAddress }
    ) {
      price
    }
  }
`;

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
    outputs: [],
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
  const { initialToken, initialCurrency, connectWeb3, Component } = props;

  const [requestedToken, setRequestedToken] = useState(initialToken);
  const [offeredToken, setOfferedToken] = useState(initialCurrency);
  const [requestedAmount, setRequestedAmount] = useState(0);
  const [offeredAmount, setOfferedAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState();
  const { loading, data } = useQuery(gql(GET_LAST_PRICE), {
    variables: {
      tokenAddress: tokenInfo[requestedToken].address,
    },
  });

  useEffect(() => {
    if (!loading) {
      doSetRequestedAmount(requestedAmount);
    }
  }, [loading, requestedToken]);

  const canPerformTokenRequest =
    requestedToken &&
    requestedAmount > 0 &&
    offeredToken &&
    offeredAmount > 0 &&
    !loading;

  const doSetRequestedAmount = (amount) => {
    const actualAmount = amount || 0;
    const price =
      Number.parseFloat(data.hourHistoricalDatas[0].price) / 10 ** 6;
    setRequestedAmount(actualAmount);
    setOfferedAmount(round(actualAmount * price, 2));
  };

  const doSetOfferedAmount = (amount) => {
    var actualAmount = amount || 0;
    const price =
      Number.parseFloat(data.hourHistoricalDatas[0].price) / 10 ** 6;
    setOfferedAmount(actualAmount);
    setRequestedAmount(round(actualAmount / price, 2));
  };

  const doPerformTokenRequest = async () => {
    const [web3, address] = await connectWeb3();
    if (web3 && address && canPerformTokenRequest) {
      const requestedAmountDecimals = requestedAmount * 10 ** 18;
      const offeredAmountDecimals =
        offeredAmount * 10 ** currencyInfo[offeredToken].decimals;
      const offeredTokenAddress = currencyInfo[offeredToken].address;
      const daoAddress = tokenInfo[requestedToken].dao;

      // Check eth balance and offered token balance
      //
      const ethBalance = await web3.eth.getBalance(address);
      if (ethBalance <= 0) {
        setErrorMessage("Not enough eth on balance to pay transaction fee");
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
      if (!balanceFloat || balanceFloat < offeredAmountDecimals) {
        setErrorMessage("Not enough tokens on balance");
        return;
      }
      // Check allowance
      //
      const allowance = await offeredTokenContract.methods
        .allowance(address, daoAddress)
        .call();
      const allowanceFloat = Number.parseFloat(allowance);
      if (!allowanceFloat || allowanceFloat < offeredAmountDecimals) {
        // If allowance != 0 and token is USDT reset approval first,
        // otherwise transaction will fail
        //
        if (allowanceFloat && allowanceFloat > 0 && offeredToken === "usdt") {
          await offeredTokenContract.methods
            .approve(daoAddress, toBigNumberString("0"))
            .send({
              from: address,
            });
        }
        // Require approval first
        //
        await offeredTokenContract.methods
          .approve(daoAddress, toBigNumberString(10 ** 28))
          .send({
            from: address,
          });
      }
      const daoContract = new web3.eth.Contract(DAO_ABI, daoAddress);
      await daoContract.methods
        .createTokenRequest(
          offeredTokenAddress,
          toBigNumberString(offeredAmountDecimals),
          toBigNumberString(requestedAmountDecimals),
          ""
        )
        .send({
          from: address,
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
      canPerformTokenRequest={canPerformTokenRequest}
      errorMessage={errorMessage}
    />
  );
}

export default TokenRequestController;
