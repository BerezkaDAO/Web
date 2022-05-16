const DaoAbi = [
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

export default DaoAbi;
