import Arweave from "arweave";
import { useEffect, useState } from "react";
import { useAccount, useSignMessage } from "wagmi";

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});

export function useUploader(data: string | undefined) {
  const { isConnected, address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const [txId, setTxId] = useState<string>();
  const [error, setError] = useState<string>();
  const [progress, setProgress] = useState<number>(0);

  async function uploadToArweave(data: string) {
    try {
      if (!isConnected || !address) {
        throw new Error("Please connect your wallet first");
      }

      // Create transaction
      const transaction = await arweave.createTransaction({ data });
      console.log(transaction);

      // Add tags to help identify the data type
      transaction.addTag("Content-Type", "application/json");
      transaction.addTag("Upload-Date", new Date().toISOString());
      transaction.addTag("Uploader-Address", address);

      // Get the transaction data to sign
      const dataToSign = transaction.data;

      // Sign the transaction data using the connected wallet
      const signature = await signMessageAsync({
        message: `Sign to confirm Arweave upload: ${dataToSign}`,
      });
      console.log(signature);

      // Add the signature as a tag
      transaction.addTag("ETH-Signature", signature);

      // Upload the transaction
      const uploader = await arweave.transactions.getUploader(transaction);

      while (!uploader.isComplete) {
        await uploader.uploadChunk();
        setProgress(uploader.pctComplete);
      }

      setTxId(transaction.id);
    } catch (error) {
      setError(String(error));
    }
  }

  useEffect(() => {
    if (data) {
      setTxId(undefined);
      setError(undefined);
      setProgress(0);
      uploadToArweave(data);
    }
  }, [data]);

  return { progress, txId, error };
}
