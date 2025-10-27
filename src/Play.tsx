import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { useContractWrite } from "wagmi";
import { parseEther } from "viem";
import barrel from "./barrel.png";
import { BigNumber } from "ethers";
import { useRef } from "react";
import { error } from "console";

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

  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "play",
    onError: (error: any) => {
      console.error("error message", error.message);

      // Check if it's an insufficient funds error
      if (
        error?.cause?.reason?.includes("insufficient funds") ||
        error?.message?.includes("insufficient funds")
      ) {
        setErrorMessage(
          "You don't have enough ETH in your wallet to play. You can top up your balance on the faucet: sepoliafaucet.vercel.app"
        );
      } else if (
        error?.cause?.reason?.includes("Connector not found") ||
        error?.message?.includes("Connector not found")
      ) {
        setErrorMessage("Please connect your wallet to play");
      } else {
        setErrorMessage("Transaction failed. Please try again.");
      }
    },
    onSuccess: () => {
      setErrorMessage(null); // Clear any previous errors
    },
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [playerNumbers, setPlayerNumbers] = useState<number[]>([]);
  const [lastWinner, setLastWinner] = useState<boolean>(false);
  const [poolSize, setPoolSize] = useState<number>(0);
  const { address } = useAccount();

  // Reset error message when the wallet address changes
  useEffect(() => {
    setErrorMessage(null);
    setHasPlayed(false);
  }, [address]);

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

  // Fetch player numbers
  useEffect(() => {
    if (!address || !contractRef.current) {
      setPlayerNumbers([]);
      return;
    }

    const getPlayerNumber = async () => {
      try {
        const array = await contractRef.current!.getPlayerNumber(address);
        setPlayerNumbers(array.map((num: BigNumber) => num.toNumber()));
      } catch (error) {
        console.error(error);
      }
    };

    getPlayerNumber(); // run immediately
    const intervalId = setInterval(getPlayerNumber, 3000); // slower polling

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

  const [hasPlayed, setHasPlayed] = useState(false);
  const handlePlay = async () => {
    try {
      setHasPlayed(true);

      await write({ value: parseEther("0.01") });
      // Force immediate refresh
      const array = await contractRef.current!.getPlayerNumber(address);
      setPlayerNumbers(array.map((num: BigNumber) => num.toNumber()));
    } catch (error) {
      console.error(error);
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

        {isLoading && (
          <span className="text-gray-500">
            (Validate transaction on your wallet)
          </span>
        )}
      </div>

      {/* Player Info */}
      <div className="space-y-6 text-gray-700">
        <div className="text-center">
          {hasPlayerNumbers && !hasPlayed ? (
            <p>
              You've been successfully registered with number
              {playerNumbers.filter((num) => num !== 0).length > 1
                ? "s"
                : ""}: {playerNumbers.filter((num) => num !== 0).join(", ")}.
            </p>
          ) : hasPlayed && address && !errorMessage && data ? (
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
                  href={`https://sepolia.etherscan.io/tx/${data.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  transaction
                </a>{" "}
                confirmation to display your player number...
              </span>
            </div>
          ) : (
            isSuccess && <p>success</p>
          )}
        </div>

        <p className="text-center text-lg font-semibold ">
          Currently {poolSize} player{poolSize !== 1 ? "s" : ""} in the round.{" "}
          Only {6 - poolSize} missing for the showdown to start!
        </p>

        {/* Winner Messages */}
        {address &&
          !lastWinner &&
          !hasPlayerNumbers &&
          hasPlayed &&
          !errorMessage && (
            <p className="font-semibold text-center text-red-600">
              You didn't win the last round of roulette. Try again!
            </p>
          )}

        {lastWinner && !hasPlayerNumbers && (
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
            className={`w-32 h-32 ${
              lastWinner && !hasPlayerNumbers ? "animate-spin" : ""
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default Play;
