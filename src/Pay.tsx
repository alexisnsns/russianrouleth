import React from "react";
import { useContractWrite } from "wagmi";
import { parseEther } from "viem";

const contractABI = [
  {
    name: "play",
    outputs: [],
    inputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    name: "getPlayerNumber",
    outputs: [
      {
        type: "uint256",
        name: "",
      },
    ],
    inputs: [
      {
        type: "address",
        name: "player",
      },
    ],
    stateMutability: "view",
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
    address: "0x278503E3Acd6Efb77589A1581Fcd7D213D9A8d33",
    abi: contractABI,
    functionName: "play",
  });

  return (
    <div>
      <button
        className="button"
        onClick={() => write({ value: parseEther("0.01") })}
      >
        Spin the Barrel, Take Your Chance
      </button>
      {isLoading && <div>Check Wallet</div>}
      {isSuccess && <div>Transaction: {JSON.stringify(data)}</div>}
    </div>
  );
};

export default Pay;
