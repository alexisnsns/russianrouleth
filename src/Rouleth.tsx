import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import EthValue from "./EthValue";
import Play from "./Play";

const TestRouleth = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-between py-10 px-4">
      <div className="w-full max-w-3xl flex justify-end space-x-4 mb-10">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
          onClick={() =>
            window.open("https://sepoliafaucet.vercel.app/", "_blank")
          }
        >
          Sepolia ETH Faucet
        </button>
        <ConnectButton />
      </div>

      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Welcome to the{" "}
          <span className="italic text-indigo-600">Russian Rouleth</span>
        </h1>

        <div className="space-y-4 text-gray-700">
          <h3 className="text-xl font-semibold">The rules are simple:</h3>
          <p>Each player's entry fee for a round is 0.01 Sepolia ETH.</p>
          <p>
            Every 6 participants,{" "}
            <b>the smart contract selects one of them at random.</b>
          </p>
          <p>
            This winner <b>receives instantly</b> a payout of approximately{" "}
            <b>six times their entry fee.</b>
          </p>
          <p>
            Once the winner is paid, a new round begins, and the process
            repeats.
          </p>
          <p>
            You can participate as many times as you like, in the same round (to
            increase your chances of winning) or in different rounds.
          </p>

          <p>
            The game runs entirely on-chain, meaning all logic — from player
            entries to payouts — is handled by the smart contract itself:{" "}
            <b>this roulette can't be rigged.</b>
          </p>
          <p>
            For legal reasons, the roulette is only available on testnets for
            now.
          </p>

          <h3 className="text-lg font-semibold">
            To participate in the current round, click the button below:
          </h3>
          <p>
            You will be prompted to send 0.01 Sepolia ETH, your entry fee, to
            the smart contract roulette.
          </p>

          <div className="flex justify-center mt-4">
            <Play />
          </div>
        </div>
      </div>

      <footer className="w-full max-w-3xl mx-auto mt-10 text-center text-gray-500 text-xs space-y-2">
        <p>
          &copy; {new Date().getFullYear()} Russian Rouleth. Code can be audited{" "}
          <a
            href="https://github.com/alexisnsns/russianrouleth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            here
          </a>{" "}
          and the smart contract{" "}
          <a
            href="https://sepolia.etherscan.io/address/0x8060b01a9aae337f98f42e19b0a4abf7fd8e39c6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            here
          </a>
          .
        </p>

        <p>
          <a
            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
              "https://russianrouleth.xyz"
            )}&text=${encodeURIComponent("Let's play some Russian Rouleth..")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 font-medium hover:underline"
          >
            Share on Twitter
          </a>
        </p>
      </footer>
    </div>
  );
};

export default TestRouleth;
