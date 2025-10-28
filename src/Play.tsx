import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { parseEther } from "viem";
import barrel from "./barrel.png";
import { BigNumber } from "ethers";
import { useRef } from "react";
import { useWriteContract } from "wagmi";
import { usePublicClient } from "wagmi";

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
  // Boolean: has the connected address won the last round?
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

  // Reload states when the address changes
  useEffect(() => {
    setErrorMessage(null);
    setLastWinner(false);
    setPlayerNumbers(null);
    setTxHash(null);

    if (!contractRef.current || !address) return;

    isLastWinner();
    getPlayerNumber();
    getPoolSize();
  }, [address]);

  // Get current pool size on page load
  useEffect(() => {
    getPoolSize();
  }, []);

  // Transaction and play function
  const handlePlay = async () => {
    try {
      setGameStarted(true);
      setErrorMessage(null);
      const hash = await writeContractAsync({
        address: contractAddress,
        abi: contractABI,
        functionName: "play",
        value: parseEther("0.01"),
      });

      setTxHash(hash);
      const receipt = await publicClient!.waitForTransactionReceipt({ hash });
      console.log("receipt:", receipt);
      setGameStarted(false);
      await isLastWinner();
      await getPoolSize();
      await getPlayerNumber();
    } catch (err: any) {
      console.error("error:", err.message);
      if (err.message?.toLowerCase().includes("user rejected")) {
        setErrorMessage("You canceled the transaction.");
      } else if (
        err.message?.toLowerCase().includes("connector not connected")
      ) {
        setErrorMessage(
          "Wallet not connected — please connect to start playing."
        );
      } else {
        setErrorMessage("Error: " + err.message);
      }
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
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M12 2a10 10 0 0110 10h-2a8 8 0 10-8 8v2a10 10 0 010-20z"
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
          {6 - poolSize} missing for the showdown to start!
        </p>

        {/* Winner Messages */}
        {address && !lastWinner && !errorMessage && (
          <p className="font-semibold text-center text-red-600">
            You didn't win the last round of roulette. Try again!
          </p>
        )}
        {lastWinner && (
          <p className="font-bold text-center text-green-600">
            YOU WON THE ROULETTE! CONGRATULATIONS! THE ETH HAS BEEN SENT TO YOUR
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
