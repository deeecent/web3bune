import {
  Button,
  HStack,
  Link,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import "./Create.css";
import {
  useAccount,
  useChainId,
  useEnsName,
  useReadContract,
  useTransaction,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi";
import { web3buneAbi as abi, web3buneAddress } from "./generated";
import { useEffect, useState } from "react";
import syncFetch from "sync-fetch";
import { useSearchParams } from "react-router-dom";
import { strongCipher } from "./utils/cipher";

interface PostParams {
  tokenID: bigint;
}

interface Post {
  tokenURI: string;
  price: bigint;
  feeBasisPoints: bigint;
}

interface PostMetadata {
  title: string;
  content: string;
  description: string;
  author: string;
}

function Article(props: PostParams) {
  const { tokenID } = props;
  const [searchParams] = useSearchParams();
  const [txHash, setTxHash] = useState<`0x${string}`>();
  const toast = useToast();

  const account = useAccount();
  const chainId = useChainId();
  const { data: txData } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const [accountIsAuthor, setAccountIsAuthor] = useState(false);

  const { data: postData } = useReadContract({
    abi,
    address: web3buneAddress[chainId],
    functionName: "getPost",
    args: [tokenID],
  });

  const { data: balance } = useReadContract({
    abi,
    address: web3buneAddress[chainId],
    functionName: "balanceOf",
    args: [account.address as `0x${string}`, tokenID],
  });

  const { data: hash, writeContract, error } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [author, setAuthor] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<bigint>();
  const ensName = useEnsName({ address: author as `0x${string}` });
  const [canRead, setCanRead] = useState(false);

  useEffect(() => {
    if (balance !== undefined) {
      setCanRead(balance > 0);
    }
  }, [balance]);

  useEffect(() => {
    if (txData !== undefined) {
      console.log(txData);
      setCanRead(true);
    }
  }, [txData]);

  useEffect(() => {
    setTxHash(undefined);
    if (searchParams !== undefined) {
      const txId = searchParams.get("txId");
      if (txId !== null) {
        setTxHash(txId as `0x${string}`);
      }
    }
  }, [searchParams]);

  async function mint() {
    if (account === undefined || account.address === undefined) {
      toast({
        title: "Error",
        description: `No account connected`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    writeContract({
      abi,
      address: web3buneAddress[chainId],
      functionName: "mint",
      args: [account.address, BigInt(tokenID)],
      value: price,
    });
  }

  useEffect(() => {
    if (error) {
      console.log(error);
    }
  }, [error]);

  useEffect(() => {
    if (postData !== undefined) {
      const post = postData as Post;
      const metadata = syncFetch(post.tokenURI).json() as PostMetadata;

      setContent(strongCipher(metadata.content, -42));
      setDescription(metadata.description);
      setTitle(metadata.title);
      setPrice(post.price);
      setAuthor(metadata.author);
    }
  }, [postData]);

  return (
    <VStack className="form" height="70vh" width="50%">
      <Text width="100%" fontSize="30px">
        Article
      </Text>
      <Text>{title}</Text>
      <Text>{description}</Text>

      {canRead && <Text>{strongCipher(content, -42)}</Text>}
      {!canRead && (
        <VStack width="30%">
          <Text>Content Locked</Text>
          <Button onClick={mint}>
            {isConfirming ? "Confirming..." : "MINT UNLOCK NFT"}
          </Button>
        </VStack>
      )}

      <HStack width="100%">
        <Text width="30%">Author:</Text>
        <Text>{ensName && ensName.data ? ensName.data : author}</Text>
      </HStack>
      <Spacer />
    </VStack>
  );
}

export default Article;
