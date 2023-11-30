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
  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: "0xCea1a35B11b167891B66893655bfA0727E8ee8ba",
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
      {isLoading && <div>Validate transaction on your wallet</div>}
      {isError && <div>Error: you did not validate the transaction</div>}

      {data && isSuccess && (
        <div>
          See your&nbsp;
          <a
            href={`https://sepolia.etherscan.io/tx/${data.hash}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            transaction
          </a>
          &nbsp;on the block explorer
        </div>
      )}
    </div>
  );
};

export default Pay;
