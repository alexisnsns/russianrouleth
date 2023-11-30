import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

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
const contractAddress = "0xCea1a35B11b167891B66893655bfA0727E8ee8ba";

const PlayerNumber = () => {
  const [playerNumber, setPlayerNumber] = useState("0");
  const { address } = useAccount();

  // @ts-ignore
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  useEffect(() => {
    const getPlayerNumber = async () => {
      try {
        const number = await contract.getPlayerNumber(address);
        setPlayerNumber(number.toString());
      } catch (error) {
        console.error("Error fetching player number:", error);
      }
    };

    // Fetch player number immediately and then set an interval
    getPlayerNumber();
    const intervalId = setInterval(getPlayerNumber, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [address]);

  return (
    <div>
      <p>
        {playerNumber === "0"
          ? "Waiting for your transaction to resolve to display your player number..."
          : `You're number ${playerNumber} in the current round: ${
              6 - Number(playerNumber)
            } players missing for the game to begin.`}
      </p>
    </div>
  );
};

export default PlayerNumber;
