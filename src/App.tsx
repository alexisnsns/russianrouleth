import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

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
        <h1>Welcome to the Russian Rouleth</h1>
        <button>Send 0.01 ETH</button>
      </header>
    </div>
  );
}

export default App;
