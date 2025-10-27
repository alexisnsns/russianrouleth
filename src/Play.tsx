import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useContractWrite } from "wagmi";
import { parseEther } from "viem";
import barrel from "./barrel.png";
import { BigNumber } from "ethers";

// Add this at the top of your file (or in a global.d.ts)
declare global {
  interface Window {
    ethereum?: any;
  }
}

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
        type: "uint256[6]",
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
    name: "isLastWinner",
    outputs: [
      {
        type: "bool",
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
    name: "getCurrentNumPlayers",
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
    name: "lastWinner",
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
];

const contractAddress = "0x8060b01a9aae337f98f42e19b0a4abf7fd8e39c6";

const Play = () => {
  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "play",
  });

  const [playerNumbers, setPlayerNumbers] = useState<number[]>([]);
  const [lastWinner, setLastWinner] = useState<boolean>(false);
  const [poolSize, setPoolSize] = useState<number>(0);
  const { address } = useAccount();

  let provider: ethers.providers.Web3Provider | undefined;
  let signer: ethers.Signer | undefined;
  let contract: ethers.Contract | undefined;

  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
  }

  // Fetch player numbers
  useEffect(() => {
    const getPlayerNumber = async () => {
      if (!contract || !address) return;
      try {
        const array = await contract.getPlayerNumber(address);
        setPlayerNumbers(array.map((num: BigNumber) => num.toNumber()));
      } catch (error) {
        console.error(error);
      }
    };
    getPlayerNumber();
    const intervalId = setInterval(getPlayerNumber, 1000);
    return () => clearInterval(intervalId);
  }, [address]);

  // Check last winner
  useEffect(() => {
    const isLastWinner = async () => {
      if (!contract || !address) return;
      try {
        const bool = await contract.isLastWinner(address);
        setLastWinner(bool);
      } catch (error) {
        console.error(error);
      }
    };
    isLastWinner();
    const intervalId = setInterval(isLastWinner, 1000);
    return () => clearInterval(intervalId);
  }, [address]);

  // Get current pool size
  useEffect(() => {
    const getPoolSize = async () => {
      if (!contract) return;
      try {
        const pool = await contract.getCurrentNumPlayers();
        setPoolSize(pool.toNumber()); 
      } catch (error) {
        console.error(error);
      }
    };
    getPoolSize();
    const intervalId = setInterval(getPoolSize, 1000);
    return () => clearInterval(intervalId);
  }, []);

  const hasPlayerNumbers =
    playerNumbers.length > 0 && !playerNumbers.every((num) => num === 0);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg space-y-6">
      {/* Play Button */}
      <div className="flex flex-col items-center space-y-3">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
          onClick={() => write({ value: parseEther("0.01") })}
        >
          Spin the Barrel, Take Your Chance
        </button>
        {isLoading && (
          <span className="text-gray-500">
            (Validate transaction on your wallet)
          </span>
        )}
        {isError && (
          <span className="text-red-500">
            (Error: you did not connect your wallet or validate the transaction)
          </span>
        )}
        {data && isSuccess && (
          <span className="text-green-600">
            (See your{" "}
            <a
              href={`https://sepolia.etherscan.io/tx/${data.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              transaction
            </a>{" "}
            on the block explorer)
          </span>
        )}
      </div>

      {/* Player Info */}
      <div className="space-y-4 text-gray-700">
        <p>
          {hasPlayerNumbers ? (
            <>
              You've been successfully registered with number
              {playerNumbers.filter((num) => num !== 0).length > 1
                ? "s"
                : ""}: {playerNumbers.filter((num) => num !== 0).join(", ")}.
            </>
          ) : (
            "You're not registered yet. Waiting for your transaction to display your player number..."
          )}
        </p>

        <p>
          Currently {poolSize} player(s) in the round. Only {6 - poolSize}{" "}
          missing for the showdown to start.
        </p>

        {/* Barrel Image */}
        <div className="flex justify-center">
          <img
            src={barrel}
            alt="barrel"
            className={`w-32 h-32 ${
              lastWinner && !hasPlayerNumbers ? "animate-spin" : ""
            }`}
          />
        </div>

        {/* Winner Messages */}
        <p className="font-semibold text-center text-red-600">
          {!lastWinner &&
            !hasPlayerNumbers &&
            "You didn't win the last round of roulette. Try again!"}
        </p>
        <p className="font-bold text-center text-green-600">
          {lastWinner &&
            !hasPlayerNumbers &&
            "YOU WON THE ROULETTE! CONGRATULATIONS! THE ETH IS BEING SENT TO YOUR WALLET!"}
        </p>
      </div>
    </div>
  );
};

export default Play;
