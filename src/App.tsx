import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Pay from "./Pay";

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            padding: 12,
          }}
        >
          <ConnectButton />
        </div>
        <h3>Welcome to the Russian Rouleth</h3>
        <div>
          <p>
            Send 0.01 eth to the casino; every 6 transactions the contract sends
            back ~0.06 eth to one of the 6 previous senders, picked randomly.
          </p>
          <h1>Send money to the casino:</h1>
          <Pay />
        </div>
      </header>
    </div>
  );
};

export default App;
