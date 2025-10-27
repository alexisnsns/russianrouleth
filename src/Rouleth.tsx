import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import EthValue from "./EthValue";
import Play from "./Play";
import { TwitterShareButton, TwitterIcon } from "react-share";

const TestRouleth = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-between py-10 px-4">
      {/* Header / Login */}
      <div className="w-full max-w-3xl flex justify-end space-x-4 mb-10">
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition"
          onClick={() =>
            window.open("https://sepoliafaucet.vercel.app/", "_blank")
          }
        >
          Sepolia Faucet
        </button>
        <ConnectButton />
      </div>

      {/* Main Content */}
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg space-y-6">
        <h1 className="text-4xl font-bold text-center text-gray-800">
          Welcome to the{" "}
          <span className="italic text-indigo-600">Russian Rouleth</span>
        </h1>

        <div className="space-y-4 text-gray-700">
          <h3 className="text-xl font-semibold">The rules are simple:</h3>
          <p>
            Each player's entry fee for a round is 0.01 ETH (≈ <EthValue />
            ).
          </p>
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
          <h3 className="text-lg font-semibold">
            To participate in the current round, click the button below:
          </h3>
          <p>
            You will be prompted to send 0.01 ETH, your entry fee, to the
            casino.
          </p>

          <div className="flex justify-center mt-4">
            <Play />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full max-w-3xl text-center mt-10 text-gray-500 text-sm space-y-2">
        <p>
          Feel free to review the casino Smart Contract&nbsp;
          <a
            href="https://sepolia.etherscan.io/address/0x8060b01a9aae337f98f42e19b0a4abf7fd8e39c6"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 hover:underline"
          >
            here
          </a>
        </p>
        <div className="flex justify-center items-center space-x-2">
          <span>// Share on</span>
          <TwitterShareButton
            url="https://russianrouleth.xyz"
            title="Let's play some Russian Rouleth.."
          >
            <TwitterIcon size={32} round />
          </TwitterShareButton>
        </div>
      </footer>
    </div>
  );
};

export default TestRouleth;
