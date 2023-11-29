import React, { useState } from "react";
import { ethers } from "ethers";

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
const contractAddress = "0x278503E3Acd6Efb77589A1581Fcd7D213D9A8d33";

const PlayerNumber = () => {
  const [playerAddress, setPlayerAddress] = useState("");
  const [playerNumber, setPlayerNumber] = useState("");

  // Initialize the contract
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const contract = new ethers.Contract(contractAddress, contractABI, signer);

  const getPlayerNumber = async () => {
    try {
      const number = await contract.getPlayerNumber(playerAddress);
      setPlayerNumber(number.toString());
    } catch (error) {
      console.error("Error fetching player number:", error);
      setPlayerNumber("Error");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={playerAddress}
        onChange={(e) => setPlayerAddress(e.target.value)}
        placeholder="Enter Player Address"
      />
      <button onClick={getPlayerNumber}>Get Player Number</button>
      {playerNumber && <p>Player Number: {playerNumber}</p>}
    </div>
  );
};

export default PlayerNumber;
