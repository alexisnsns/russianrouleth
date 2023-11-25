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
        <h1>Welcome to the Russian Rouleth</h1>
        <div>
          <Pay />
        </div>
      </header>
    </div>
  );
};

export default App;
