"use client";
import {
  DynamicContextProvider,
  DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { DynamicWagmiConnector } from "@dynamic-labs/wagmi-connector";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

const Dynamic = () => {
  return (
    <DynamicContextProvider
      settings={{
        environmentId: "3fc51bf3-aeb1-44b4-bd20-17f5e9b6e614",
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <DynamicWagmiConnector>
        <DynamicWidget />
      </DynamicWagmiConnector>
    </DynamicContextProvider>
  );
};

export default Dynamic;
