import * as React from "react";
import {
  usePrepareSendTransaction,
  useSendTransaction,
  useWaitForTransaction,
} from "wagmi";
import { parseEther } from "viem";

const Pay = () => {
  const { config } = usePrepareSendTransaction({
    to: "0x588eBB657Ca52d6fbDf8F52C760D53C1474e37Ed",
    value: parseEther("0.001"),
  });
  const { data, sendTransaction } = useSendTransaction(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        sendTransaction?.();
      }}
    >
      <button type="submit" disabled={isLoading}>
        {isLoading ? "Sending..." : "Send"}
      </button>
      {isSuccess && (
        <div>
          Successfully sent 0.001 ether to the casino.
          <div>
            <a href={`https://etherscan.io/tx/${data?.hash}`} target="_blank">
              (See tx onEtherscan)
            </a>
          </div>
        </div>
      )}
    </form>
  );
};

export default Pay;
