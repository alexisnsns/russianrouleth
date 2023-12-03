import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useNavigate } from "react-router-dom";

const Rouleth = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="login">
        <button className="routing" onClick={() => navigate("/test-rouleth")}>
          Play on TestNet
        </button>
        <ConnectButton />
      </div>
      <div>
        <h1 className="title">
          Welcome to the <i>Russian Rouleth</i>
        </h1>
      </div>
      <p> Russian Rouleth not available on mainnet yet</p>
    </>
  );
};

export default Rouleth;
