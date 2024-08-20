import {
  Box,
  Button,
  HStack,
  Input,
  NumberInput,
  NumberInputField,
  Spacer,
  Text,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import "./Create.css";
import { create } from "ipfs-http-client";
import {
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  useWatchContractEvent,
  useWriteContract,
} from "wagmi";
import { ConnectKitButton } from "connectkit";
import { web3buneAbi as abi, web3buneAddress } from "./generated";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useNavigate } from "react-router-dom";
import { strongCipher } from "./utils/cipher";

const client = create({
  url: "https://ipfs.infura.io:5001",
  headers: {
    Authorization: `Basic ${btoa("ceb90fc5a2f2447ab6e20a37021785bb" + ":" + "a57fd07610c1424dad08247da5851234")}`,
  },
});

function Create() {
  const toast = useToast();

  const ipfsURL = "https://web3bune.infura-ipfs.io/ipfs";

  const account = useAccount();
  const { data: hash, writeContract } = useWriteContract();
  const navigate = useNavigate();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const chainId = useChainId();

  const [title, setTitle] = useState<string>();
  const handleTitleChange = (event: any) => setTitle(event.target.value);

  const [description, setDescription] = useState<string>();
  const handleDescriptionChange = (event: any) =>
    setDescription(event.target.value);

  const [content, setContent] = useState<string>();
  const handleContentChange = (event: any) => setContent(event.target.value);

  const [price, setPrice] = useState<string>();
  const handlePriceChange = (event: any) => setPrice(event);

  const [fee, setFee] = useState<number>(5);
  const handleFeeChange = (event: any) => setFee(event);

  const unwatch = useWatchContractEvent({
    address: web3buneAddress[chainId],
    abi: abi,
    eventName: "PostCreated",
    args: { from: account.address },
    onLogs: (logs) => {
      console.log(logs);
      navigate(`/articles/${logs[0].args.index}`);
    },
  });
  console.log(unwatch);

  async function submit() {
    if (
      content === undefined ||
      description === undefined ||
      title === undefined ||
      price === undefined
    ) {
      const missing = [
        { value: content, title: "content" },
        { value: description, title: "description" },
        { value: title, title: "title" },
        { value: price, title: "price" },
      ]
        .filter((x) => x.value === undefined)
        .map((x) => x.title)
        .join(", ");

      toast({
        title: "Missing fields",
        description: `${missing} are missing`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const image = `
    <svg width='100%' height='100%' viewBox='0 0 600 600' xmlns='http://www.w3.org/2000/svg'
    style='background-color: black; color: white;'>
    <foreignObject width='100%' height='100%'>
        <style>
            div {
                padding: 20px;
                font-size: 30px;
                font-size: 3.5vw;
            }
        </style>
        <div xmlns='http://www.w3.org/1999/xhtml'>
        ${title}
        </div>
    </foreignObject>
</svg>`;

    const metadata = {
      title: title,
      description: description,
      content: strongCipher(content, 42),
      image: image,
      attributes: [
        {
          trait_type: "Author",
          value: account.address,
        },
      ],
    };

    try {
      const contentData = await client.add(JSON.stringify(metadata));
      let tokenURI = `${ipfsURL}/${contentData.cid.toString()}`;

      writeContract({
        abi,
        address: web3buneAddress[chainId],
        functionName: "createPost",
        args: [tokenURI, parseEther(price), BigInt(fee * 100), BigInt(500)],
      });
    } catch (error) {
      console.log("Error");
      console.log(error);
    }
  }

  useEffect(() => {
    if (isConfirmed) {
      console.log("succes");
    }
  }, [isConfirmed]);

  return (
    <VStack
      className="form"
      borderTopWidth="1px"
      borderTopColor="black"
      paddingTop="30px"
      height="50vh"
      width="60%"
    >
      <Text variant="bold">Write good stuff</Text>
      <HStack width="100%">
        <Text width="20%">Title:</Text>
        <Input
          value={title}
          isInvalid={title === undefined}
          onChange={handleTitleChange}
          width="80%"
          placeholder="Title"
        ></Input>
      </HStack>
      <HStack width="100%">
        <Text width="20%">Description (public):</Text>
        <Textarea
          value={description}
          isInvalid={description === undefined}
          onChange={handleDescriptionChange}
          width="80%"
          placeholder="Description"
        ></Textarea>
      </HStack>
      <HStack width="100%">
        <Text width="20%">Content (paid):</Text>
        <Textarea
          value={content}
          isInvalid={content === undefined}
          onChange={handleContentChange}
          width="80%"
          placeholder="Content"
        ></Textarea>
      </HStack>
      <HStack width="100%">
        <Text width="20%">Price:</Text>
        <NumberInput
          isInvalid={price === undefined}
          value={price}
          onChange={handlePriceChange}
        >
          <NumberInputField placeholder="Price" />
        </NumberInput>
      </HStack>
      <HStack width="100%">
        <Text width="20%">Aggregator fee:</Text>
        <NumberInput
          isInvalid={fee === undefined}
          value={fee}
          onChange={handleFeeChange}
        >
          <NumberInputField placeholder="Protocol fee" />
        </NumberInput>
        <Button variant="primary" onClick={() => setFee(10)}>
          10%
        </Button>
        <Button variant="primary" onClick={() => setFee(5)}>
          5%
        </Button>
        <Button variant="primary" onClick={() => setFee(15)}>
          15%
        </Button>
      </HStack>
      <HStack width="100%">
        <Text width="20%">Author:</Text>
        <ConnectKitButton.Custom>
          {({ isConnected, show, truncatedAddress, ensName }) => {
            return (
              <Box>
                {isConnected && (ensName ?? truncatedAddress)}
                {!isConnected && (
                  <Button onClick={show} variant="primary">
                    connect
                  </Button>
                )}
              </Box>
            );
          }}
        </ConnectKitButton.Custom>
      </HStack>
      <Spacer />
      <Button
        width="100%"
        padding="20px"
        variant="primary"
        disabled={!account.isConnected || isConfirming}
        onClick={submit}
      >
        {isConfirming ? "Confirming..." : "Submit"}
      </Button>
      <Spacer />
    </VStack>
  );
}

export default Create;
