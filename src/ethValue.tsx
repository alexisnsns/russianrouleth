import React, { useState, useEffect } from "react";

const EthValue = () => {
  const [ethValue, setEthValue] = useState("Loading...");

  useEffect(() => {
    const fetchEthValue = async () => {
      try {
        const response = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=USD"
        );
        const data = await response.json();
        const ethPriceInUsd = data.ethereum.usd;
        const value = ethPriceInUsd.toFixed(2);
        setEthValue(`$${value} USD`);
      } catch (error) {
        console.error("Error fetching ETH price:", error);
        setEthValue("(fetching eth price)");
      }
    };

    fetchEthValue();
  }, []);

  return (
    <>
      <i> {ethValue}</i>
    </>
  );
};

export default EthValue;
