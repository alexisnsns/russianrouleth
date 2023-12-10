import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import EthValue from "./ethValue";
import Play from "./Play";
import { useNavigate } from "react-router-dom";

const TestRouleth = () => {
  const navigate = useNavigate();

  return (
    <body>
      <div className="content-wrap">
        <div className="login">
          <button className="routing" onClick={() => navigate("/")}>
            Play on MainNet
          </button>
          <ConnectButton />
        </div>
        <h1 className="title">
          Welcome to the <i>Russian Rouleth</i>
        </h1>
        <div className="rules">
          <h3>The rules are simple:</h3>
          <br />
          <p>
            Each player's entry fee for a round is 0.01 ETH (≈
            <EthValue />
            ).
          </p>

          <br />
          <p>
            Every 6 participants,
            <b> the smart contract selects one of them at random.</b>
          </p>
          <p>
            This winner <b> receives instantly </b>a payout of approximately
            <b> six times his entry fee.</b>
          </p>
          <p>
            Once the winner is paid, a new round begins, and the process
            repeats.
          </p>
          <br />
          <p>
            You can participate as many times as you like, in the same round (to
            increase your chances of winning) or in different rounds.
          </p>
          <h3>To participate in the current round, click the button below:</h3>
          <p>
            You will be prompted to send 0.01 ETH, your entry fee, to the
            casino.
          </p>
          <Play />
        </div>
      </div>

      <footer className="footer">
        <i>
          <p>
            Feel free to review the casino Smart Contract&nbsp;
            <a
              href="https://sepolia.etherscan.io/address/0x713D9f95f1b140aE1cAf910B56bEc75B20E95b96"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </a>
            .
          </p>
        </i>
      </footer>
    </body>
  );
};

export default TestRouleth;
