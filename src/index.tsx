import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import "@rainbow-me/rainbowkit/styles.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { sepolia } from "wagmi/chains";

// ✅ Create wagmi + rainbow config
const config = getDefaultConfig({
  appName: "rouleth",
  projectId: "2d05a2fa95c4d9f74c4ef725b7af8bdd",
  chains: [sepolia],
  transports: {
    [sepolia.id]: http("https://gateway.tenderly.co/public/sepolia"),
  },
});

// ✅ Create QueryClient (required by wagmi v2)
const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <App />
        </RainbowKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
