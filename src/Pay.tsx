import React from "react";
import { ethers } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";
import { parseEther } from "viem";

const contractABI = [
  {
    name: "greet",
    outputs: [
      {
        type: "string",
        name: "",
      },
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    name: "play",
    outputs: [],
    inputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "fallback",
  },
  {
    outputs: [],
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    name: "owner",
    outputs: [
      {
        type: "address",
        name: "",
      },
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    name: "numPlayers",
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    name: "totalBalance",
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    name: "casinoBalance",
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
  },
  {
    name: "locked",
    outputs: [
      {
        type: "bool",
        name: "",
      },
    ],
    inputs: [],
    stateMutability: "view",
    type: "function",
  },
];

const Pay = () => {
  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: "0x23ffd3a633F426BC4703b4207D2062B7f4938eD1",
    abi: contractABI,
    functionName: "play",
  });

  return (
    <div>
      <button onClick={() => write({ value: parseEther("0.01") })}>Play</button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
};

export default Pay;
