import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import barrel from "./barrel.png";
import { BigNumber } from "ethers";
import { useRef } from "react";
import { error } from "console";
import { useWriteContract } from "wagmi";
import { usePublicClient } from "wagmi";

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
  const contractRef = useRef<ethers.Contract | null>(null);
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  // Message if there is an error in the TX
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  // has the player clicked the play button
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [txHash, setTxHash] = useState<string | null>(null);

  // The connected address position(s) in the current round
  const [playerNumbers, setPlayerNumbers] = useState<number[] | null>(null);
  // The number of users that have played in the current round
  const [poolSize, setPoolSize] = useState<number>(0);
  // boolean: has the connected address won?
  const [lastWinner, setLastWinner] = useState<boolean>(false);

  const nonZeroNumbers = playerNumbers?.filter((num) => num !== 0) || [];

  let provider: ethers.providers.Web3Provider | undefined;
  let signer: ethers.Signer | undefined;
  let contract: ethers.Contract | undefined;

  if (typeof window.ethereum !== "undefined") {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
    contractRef.current = new ethers.Contract(
      contractAddress,
      contractABI,
      signer
    );

    contract = new ethers.Contract(contractAddress, contractABI, signer);
  }

  // Check the position number(s) of the connected address
  const getPlayerNumber = async () => {
    try {
      const array = await contractRef.current!.getPlayerNumber(address);
      setPlayerNumbers(array.map((num: BigNumber) => num.toNumber()));
    } catch (error) {
      console.error(error);
    }
  };

  // Check if the player was the last winner
  const isLastWinner = async () => {
    if (!contract || !address) return;
    try {
      const bool = await contract.isLastWinner(address);
      setLastWinner(bool);
    } catch (error) {
      console.error(error);
    }
  };

  // Get current pool size, in this round
  const getPoolSize = async () => {
    if (!contract) return;
    try {
      const pool = await contract.getCurrentNumPlayers();
      setPoolSize(pool.toNumber());
    } catch (error) {
      console.error(error);
    }
  };

  // UseEffect when the address changes
  useEffect(() => {
    setErrorMessage(null);
    setLastWinner(false);
    setPlayerNumbers(null);
    setTxHash(null);

    if (!contractRef.current || !address) return;

    isLastWinner();
    getPlayerNumber();
  }, [address]);

  // Get current pool size on load
  useEffect(() => {
    getPoolSize();
  }, []);

  const handlePlay = async () => {
    try {
      setGameStarted(true);
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "play",
        value: parseEther("0.01"),
      });

      console.log("tx hash:", hash);
      setTxHash(hash);
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });
      console.log("receipt:", receipt);
      setGameStarted(false);
      getPoolSize();
      getPlayerNumber();
    } catch (err) {
      console.error("error:", err);
      setErrorMessage("Transaction failed. Please try again.");
    }
  };

  return (
    <div className="w-full">
      {/* Play Button */}
      <div className="flex flex-col items-center space-y-3">
        <button
          className="bg-indigo-600 mt-4 mb-4 hover:bg-indigo-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105"
          onClick={handlePlay}
        >
          Spin the Barrel, Take Your Chance
        </button>
        {errorMessage && (
          <p className="text-red-600 text-center font-semibold">
            {errorMessage}
          </p>
        )}
        {/* 
        {isLoading && (
          <span className="text-gray-500">
            (Validate transaction on your wallet)
          </span>
        )} */}
      </div>

      {/* Player Info */}
      <div className="space-y-6 text-gray-700">
        <div className="text-center">
          {gameStarted && txHash && !errorMessage ? (
            <div className="inline-flex items-center justify-center space-x-3 bg-indigo-50 px-4 py-2 rounded-lg shadow-sm">
              <svg
                className="animate-spin h-6 w-6 text-indigo-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4l-3 3 3 3h-4z"
                ></path>
              </svg>
              <span className="text-indigo-700 font-medium text-sm">
                Waiting for your{" "}
                <a
                  href={`https://sepolia.etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  transaction
                </a>{" "}
                confirmation to display your player number...
              </span>
            </div>
          ) : nonZeroNumbers.length > 0 ? (
            <p>
              You've been successfully registered as participant number{" "}
              {nonZeroNumbers.join(", ")} in the pool.
            </p>
          ) : (
            <p>{nonZeroNumbers}</p>
          )}
        </div>

        <p className="text-center text-lg font-semibold ">
          Currently {poolSize} player{poolSize !== 1 ? "s" : ""} in the round.{" "}
          Only {6 - poolSize} missing for the showdown to start!
        </p>

        {/* Winner Messages */}
        {address && !lastWinner && !errorMessage && (
          <p className="font-semibold text-center text-red-600">
            You didn't win the last round of roulette. Try again!
          </p>
        )}

        {lastWinner && (
          <p className="font-bold text-center text-green-600">
            YOU WON THE ROULETTE! CONGRATULATIONS! THE ETH IS BEING SENT TO YOUR
            WALLET!
          </p>
        )}

        {/* Barrel Image */}
        <div className="flex justify-center">
          <img
            src={barrel}
            alt="barrel"
            className={`w-32 h-32 ${lastWinner ? "animate-spin" : ""}`}
          />
        </div>
      </div>
    </div>
  );
};

export default Play;
