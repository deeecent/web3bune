import { useEffect, useState } from "react";
import { create } from "ipfs-http-client";
import { INFURA_API_KEY, INFURA_API_SECRET } from "./env";

const client = create({
  url: "https://ipfs.infura.io:5001",
  headers: {
    Authorization: `Basic ${btoa(INFURA_API_KEY + ":" + INFURA_API_SECRET)}`,
  },
});

export function useUploader(data: string | undefined) {
  const [CID, setCID] = useState<string>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  async function uploadToIPFS(data: string) {
    try {
      setPending(true);
      const contentData = await client.add(data);
      setCID(contentData.cid.toString());
      setPending(false);
    } catch (error) {
      setPending(false);
      setError(String(error));
    }
  }

  useEffect(() => {
    if (data) {
      setCID(undefined);
      setError(undefined);
      setPending(false);
      uploadToIPFS(data);
    }
  }, [data]);

  return { pending, CID, error };
}
