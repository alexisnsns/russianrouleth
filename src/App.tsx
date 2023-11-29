import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Pay from "./Pay";
import EthValue from "./ethValue";

const App = () => {
  return (
    <div>
      <div className="login">
        <ConnectButton />
      </div>
      <h1 className="title">
        Welcome to the <i>Russian Rouleth</i>
      </h1>
      <div className="rules">
        <h3>The rules are simple:</h3>
        <br />
        <p>Each player's entry fee for a round is 0.01 ETH.</p>
        <EthValue />
        <br />
        <p>
          Every 6 participants,
          <b> the smart contract selects one at random.</b>
        </p>
        <p>
          This winner <b> receives instantly </b>a payout of approximately
          <b> six times his entry fee.</b>
        </p>
        <p>
          Once the winner is paid, a new round begins, and the process repeats.
        </p>
        <br />
        <p>
          You can participate as many times as you like, in the same round (to
          increase your chances of winning) or in different rounds.
        </p>
        <h3>To participate in the current round, click the button below:</h3>
        <p>
          You will be prompted to send 0.01 ETH, your entry fee, to the casino.
        </p>
        <Pay />
        <p>Feel free to read the casino Smart Contract here.</p>
      </div>
    </div>
  );
};

export default App;
