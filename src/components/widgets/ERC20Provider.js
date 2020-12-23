import React, { useEffect, useState } from "react";

const ABI = [
  // balanceOf
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  // decimals
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

const ERC20Provider = (props) => {
  const {
    walletAddress,
    tokenAddress,
    web3,
    children,
    childrenLoading,
  } = props;

  const [loading, setLoading] = useState(true);
  const [cachedBalance, setCachedBalance] = useState();

  useEffect(() => {
    const fn = async () => {
      if (!walletAddress) {
        setCachedBalance(0);
      } else {
        const contract = new web3.eth.Contract(ABI, tokenAddress);
        const balance = await contract.methods.balanceOf(walletAddress).call();
        const decimals = await contract.methods.decimals().call();
        const balanceFinal = balance ? balance / 10 ** decimals : balance;
        setCachedBalance(balanceFinal);
        setLoading(false);
      }
    };
    fn();
  }, [walletAddress, tokenAddress]);

  if (loading) {
    return <>{childrenLoading()}</>;
  }
  return <>{children(cachedBalance)}</>;
};

export default ERC20Provider;
