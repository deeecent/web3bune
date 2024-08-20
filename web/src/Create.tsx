import {
  Box,
  Button,
  HStack,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Spacer,
  Text,
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
import { propcornAbi as abi, propcornAddress } from "./generated";
import { useEffect, useState } from "react";
import { parseEther } from "viem";
import { useNavigate } from "react-router-dom";

const client = create({
  url: "https://ipfs.infura.io:5001",
  headers: {
    Authorization: `Basic ${btoa("ceb90fc5a2f2447ab6e20a37021785bb" + ":" + "a57fd07610c1424dad08247da5851234")}`,
  },
});

function Create() {
  const toast = useToast();

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

  const [price, setPrice] = useState<number>();
  const handlePriceChange = (event: any) => setPrice(event);

  const [fee, setFee] = useState<number>(5);
  const handleFeeChange = (event: any) => setFee(event);

  const unwatch = useWatchContractEvent({
    address: propcornAddress[chainId],
    abi: abi,
    eventName: "ProposalCreated",
    args: { from: account.address },
    onLogs: (logs) => {
      navigate(`/proposals/${account.address}/${logs[0].args.index}`);
    },
  });
  console.log(unwatch);

  async function submit() {
    if (
      content === undefined ||
      description === undefined ||
      title == undefined
    ) {
      const missing = [
        { value: content, title: "content" },
        { value: description, title: "description" },
        { value: title, title: "title" },
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

    let contentCID;
    let descriptionCID;
    try {
      const contentData = await client.add(content);
      contentCID = contentData.cid;
      const descriptionData = await client.add(description);
      descriptionCID = descriptionData.cid;
    } catch (error) {
      console.log("Error");
      console.log(error);
    }

    /*writeContract({
      abi,
      address: propcornAddress[chainId],
      functionName: "createProposal",
      args: [title, BigInt(totalTime), parseEther(amount), BigInt(fee * 100)],
    });*/
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
        <Text width="20%">Description:</Text>
        <Input
          value={description}
          isInvalid={description === undefined}
          onChange={handleDescriptionChange}
          width="80%"
          placeholder="Description"
        ></Input>
      </HStack>
      <HStack width="100%">
        <Text width="20%">Content:</Text>
        <Input
          value={content}
          isInvalid={content === undefined}
          onChange={handleContentChange}
          width="80%"
          placeholder="Content"
        ></Input>
      </HStack>
      <HStack width="100%">
        <Text width="20%">Title:</Text>
        <Input
          value={title}
          isInvalid={title === undefined}
          onChange={handleTitleChange}
          width="80%"
          placeholder="Github Issue link"
        ></Input>
      </HStack>

      <HStack width="100%">
        <Text width="20%">Protocol fee:</Text>
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
        <Text width="20%">Creator:</Text>
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
