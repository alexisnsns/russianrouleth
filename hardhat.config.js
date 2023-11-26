require("@nomiclabs/hardhat-vyper");
require("@nomiclabs/hardhat-ethers");
require('dotenv').config();

module.exports = {
  vyper: {
    version: "0.2.4",
  },
  networks: {
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [process.env.VITE_SEPOLIA],
    },
  },
};
