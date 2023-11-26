require("@nomiclabs/hardhat-vyper");
require("@nomiclabs/hardhat-ethers");

module.exports = {
  vyper: {
    version: "0.2.4",
  },
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [import.meta.env.VITE_SEPOLIA],
    },
  },
};
