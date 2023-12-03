import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
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
const contractAddress = "0x789a359D8Ef6765c659164c5b22f9B891F3143c9";

const Play = () => {
  const { data, isLoading, isSuccess, isError, write } = useContractWrite({
    address: contractAddress,
    abi: contractABI,
    functionName: "play",
  });

  const [playerNumber, setPlayerNumber] = useState<string>("0");
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

  const [lastWinner, setLastWinner] = useState<boolean>(false);

  useEffect(() => {
    const isLastWinner = async () => {
      try {
        const bool = await contract.isLastWinner(address);
        setLastWinner(bool);
      } catch (error) {
        console.error("Error fetching last winner:", error);
      }
    };

    // Fetch player number immediately and then set an interval
    isLastWinner();
    const intervalId = setInterval(isLastWinner, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [address]);

  const [poolSize, setPoolSize] = useState<number>(0);

  useEffect(() => {
    const getPoolSize = async () => {
      try {
        const pool = await contract.getCurrentNumPlayers();
        setPoolSize(pool);
      } catch (error) {
        console.error("Error fetching pool size:", error);
      }
    };

    // Fetch player number immediately and then set an interval
    getPoolSize();
    const intervalId = setInterval(getPoolSize, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, [address]);

  // console.log("poolsize", poolSize.toString());
  // console.log("lastwinner?", lastWinner);
  // console.log("didwin", poolSize.toString() === "0" && !lastWinner);

  return (
    <>
      <div>
        <button
          className="button"
          onClick={() => write({ value: parseEther("0.01") })}
        >
          Spin the Barrel, Take Your Chance
        </button>
        {isLoading && <div>(Validate transaction on your wallet)</div>}
        {isError && <div>(Error: you did not validate the transaction)</div>}
        {data && isSuccess && (
          <div>
            (See your&nbsp;
            <a
              href={`https://sepolia.etherscan.io/tx/${data.hash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              transaction
            </a>
            &nbsp;on the block explorer)
          </div>
        )}
      </div>
      <div>
        <p>
          <b>
            {playerNumber === "0"
              ? "You're not registered yet. Waiting for your transaction to display your player number..."
              : `You've been succesfully registered to play in the current round with the number ${playerNumber}.`}
          </b>
        </p>
        <p>
          Currently {String(poolSize)} player(s) in the round. Only{" "}
          {6 - poolSize} missing for the showdown to start.
        </p>

        <p>
          {" "}
          <b>
            {!lastWinner &&
              playerNumber === "0" &&
              "You didn't win the last round of roulette. Try again!"}
          </b>
        </p>
        <b>
          <p>
            {lastWinner &&
              playerNumber === "0" &&
              "YOU WON THE ROULETTE! CONGRATULATIONS!"}
          </p>
        </b>
      </div>
    </>
  );
};

export default Play;
