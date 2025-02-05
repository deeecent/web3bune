import { useEffect, useState } from "react";
// define your extension array
import TurndownService from "turndown";
import ProgressBar from "@ramonak/react-progress-bar";
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { GlitchButton, Header, Windows98ButtonGroup } from "./CustomComponents";
import Showdown from "showdown";
import { EthToUsdConverter } from "./EthConverter";
import { TiptapEditor, FloatingMenu } from "./Editor";
import {
  useAccount,
  useTransactionConfirmations,
  useWaitForTransactionReceipt,
} from "wagmi";
import {
  useWriteWeb3buneCreatePost,
  web3buneAbi,
  web3buneAddress,
} from "./generated";
import { strongCipher } from "./utils/cipher";
import { useUploader } from "./IPFS";
import { parseEther } from "viem";
import { useEnvChainId } from "./env";
import { Link, useNavigate } from "react-router-dom";
import { usePublicClient } from "wagmi";

const STORAGE_KEY_TITLE = "TMP_TITLE";
const STORAGE_KEY_PREVIEW = "TMP_PREVIEW";
const STORAGE_KEY_PAID = "TMP_PAID";

function ArticlePriceInput({
  defaultValue,
  onChange,
}: {
  defaultValue: string;
  onChange: (value: string) => any;
}) {
  const [value, setValue] = useState<string>(defaultValue);
  const handleValueChange = (event: any) => setValue(event.target.value);
  const [debouncedValue, setDebouncedValue] = useState(
    parseFloat(defaultValue)
  );

  useEffect(() => {
    onChange(value);

    const handler = setTimeout(() => {
      setDebouncedValue(parseFloat(value)); // Update debounced value after 1 second
    }, 1000);

    return () => clearTimeout(handler); // Clear timeout on value change
  }, [value]);

  return (
    <VStack alignItems="left">
      <Text
        variant="boldTitle"
        textAlign="left"
        fontSize="1em"
        marginTop="20px"
      >
        Article Price
      </Text>
      <HStack>
        <InputGroup width="50%" minWidth="90px">
          <Input
            borderRadius="0px"
            color="black"
            textAlign="right"
            backgroundColor="white"
            onChange={handleValueChange}
            value={value}
          ></Input>
          <InputRightElement pointerEvents="none">
            <Text>ETH</Text>
          </InputRightElement>
        </InputGroup>
        <EthToUsdConverter ethValue={parseEther(debouncedValue.toString())} />
      </HStack>
    </VStack>
  );
}

function ConfigurationInput({
  title,
  defaultValue,
  labels,
  onChange,
}: {
  title: string;
  defaultValue: string;
  labels: string[];
  onChange: (value: string) => any;
}) {
  const [value, setValue] = useState<string>(defaultValue);
  const handleValueChange = (event: any) => setValue(event.target.value);

  useEffect(() => onChange(value), [value]);

  return (
    <VStack alignItems="left">
      <Text textAlign="left" marginTop="10px">
        {title}
      </Text>
      <HStack>
        <InputGroup minWidth="90px">
          <Input
            borderRadius="0px"
            color="black"
            textAlign="right"
            backgroundColor="white"
            onChange={handleValueChange}
            value={value}
          ></Input>
          <InputRightElement pointerEvents="none">
            <Text>%</Text>
          </InputRightElement>
        </InputGroup>
        <Windows98ButtonGroup
          onClick={(index) => setValue(labels[index].replace("%", ""))}
          labels={labels}
        />
      </HStack>
    </VStack>
  );
}

type SubmissionData = {
  title: string;
  paidContent: string;
  freeContent: string;
  price: number;
  distributorReward: number;
  networkTip: number;
};

function SubmissionHandler({ data }: { data: SubmissionData }) {
  const TOTAL_CONFIRMATIONS = 3;

  const { isOpen, onOpen, onClose } = useDisclosure();

  const chainId = useEnvChainId();
  const account = useAccount();
  const toast = useToast();

  const navigate = useNavigate();

  const [jsonData, setJsonData] = useState<string>();
  const { pending, ipfsURL, error: metaError } = useUploader(jsonData);
  const [sentence, setSentence] = useState("");
  const [articleId, setArticleId] = useState<bigint>();

  const [progress, setProgress] = useState(0);
  const publicClient = usePublicClient({ chainId: chainId });

  // Set up the event listener
  useEffect(() => {
    const unwatch = publicClient.watchContractEvent({
      address: web3buneAddress[chainId],
      abi: web3buneAbi,
      eventName: "PostCreated",
      onError: (error) => {
        console.log(error);
      },
      onLogs: (logs) => {
        console.log(logs);
        if (logs[0].args.from === account.address) {
          setArticleId(logs[0].args.index);
        }
      },
    });

    // Cleanup
    return () => {
      unwatch();
    };
  }, [chainId, publicClient]);

  const {
    data: hash,
    writeContract,
    error: submitError,
  } = useWriteWeb3buneCreatePost();

  const {
    isLoading: isConfirming,
    isSuccess,
    error: txError,
  } = useWaitForTransactionReceipt({
    hash,
    confirmations: TOTAL_CONFIRMATIONS,
  });

  const { data: confirmationsData } = useTransactionConfirmations({
    chainId,
    hash,
    query: {
      refetchInterval: 1,
    },
  });

  async function submit() {
    if (
      data.paidContent === undefined ||
      data.freeContent === undefined ||
      data.title === undefined ||
      data.price === undefined
    ) {
      const missing = [
        { value: data.paidContent, title: "paid content" },
        { value: data.freeContent, title: "free contentß" },
        { value: data.title, title: "title" },
        { value: data.price, title: "price" },
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
    setSentence("Uploading article to decentralized storage....");
    onOpen();
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
        ${data.title}
        </div>
    </foreignObject>
</svg>`;

    const metadata = {
      title: data.title,
      description: data.freeContent,
      content: strongCipher(data.paidContent, 42),
      image: image,
      attributes: [
        {
          trait_type: "Author",
          value: account.address,
        },
      ],
    };

    setJsonData(JSON.stringify(metadata));
  }

  useEffect(() => {
    if (Number(confirmationsData) >= TOTAL_CONFIRMATIONS) {
      return;
    } else if (Number(confirmationsData) > 0) {
      setSentence(`${3 - Number(confirmationsData)} confirmations left...`);
      setProgress(
        (40 + 60 / TOTAL_CONFIRMATIONS) *
          Math.min(Number(confirmationsData), TOTAL_CONFIRMATIONS)
      );
    }
  }, [confirmationsData]);

  useEffect(() => {
    if (articleId !== undefined) {
      navigate(`/read/${articleId}`);
    }
  }, [articleId]);

  useEffect(() => {
    if (hash !== undefined) {
      setProgress(progress + 15);
      setSentence(`${TOTAL_CONFIRMATIONS} confirmations left...`);
    }
  }, [hash]);

  useEffect(() => {
    if (ipfsURL !== undefined) {
      setProgress(progress + 25);
      setSentence("Waiting for wallet confirmation...");
      writeContract({
        chainId,
        args: [
          ipfsURL,
          parseEther(String(data.price)),
          BigInt(data.distributorReward * 100),
          BigInt(data.networkTip * 100),
        ],
      });
    }
  }, [ipfsURL]);

  useEffect(() => {
    if (submitError) {
      toast({
        title: "Error",
        description: `Transaction error ${submitError}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    if (txError) {
      toast({
        title: "Error",
        description: `Transaction error ${txError}`,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [submitError, txError]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Success",
        description: "Article created",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }, [isSuccess]);

  return (
    <Box width="100%">
      <GlitchButton
        isLoading={isConfirming}
        onClick={submit}
        label="Publish Article"
      />
      {isSuccess === false && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent padding="20px">
            <ModalHeader>Uploading...</ModalHeader>
            <ProgressBar
              completed={progress}
              baseBgColor="rgb(240, 240, 240)"
              bgColor="rgb(51,51,51)"
              borderRadius="0px"
              labelColor="white"
              margin="0 auto"
              width="80%"
            />
            <ModalCloseButton />
            <ModalBody>{sentence}</ModalBody>
          </ModalContent>
        </Modal>
      )}
      {isSuccess && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Success!</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              You will be automatically redirected to your article. If not,
              check your{" "}
              <Link
                style={{ textDecoration: "underline" }}
                to={`/authors/${account}`}
              >
                author page
              </Link>
            </ModalBody>

            <ModalFooter>
              <Button variant="primary" mr={3} onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}

function Write() {
  const [title, setTitle] = useState("");
  const [freeContent, setFreeContent] = useState("");
  const [paidContent, setPaidContent] = useState("");

  const DEFAULT_PRICE = 0.001;
  const DEFAULT_NETWORK_TIP = 0.01;
  const DEFAULT_DISTRIBUTOR_REWARD = 0.1;

  const [price, setPrice] = useState(DEFAULT_PRICE);
  const [networkTip, setNetworkTip] = useState(DEFAULT_NETWORK_TIP);
  const [distributorReward, setDistributorReward] = useState(
    DEFAULT_DISTRIBUTOR_REWARD
  );

  const turndownService = new TurndownService();
  const markdownConverter = new Showdown.Converter();

  const [activeEditor, setActiveEditor] = useState<any>(null);

  const handleEditorFocus = (editor: any) => {
    setActiveEditor(editor);
  };

  const handlePreviewChange = (value: string) => {
    setFreeContent(value);
    const markdown = turndownService.turndown(value); // Convert HTML to Markdown
    localStorage.setItem(STORAGE_KEY_PREVIEW, markdown);
  };

  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
    localStorage.setItem(STORAGE_KEY_TITLE, event.target.value);
  };

  const handleNetworkTipChange = (value: string) => {
    setNetworkTip(parseFloat(value) / 100);
  };

  const handleDistributorRewardChange = (value: string) => {
    setDistributorReward(parseFloat(value) / 100);
  };

  const handlePriceChange = (value: string) => {
    setPrice(parseFloat(value));
  };

  const handlePaidChange = (value: string) => {
    setPaidContent(value);
    const markdown = turndownService.turndown(value); // Convert HTML to Markdown
    localStorage.setItem(STORAGE_KEY_PAID, markdown);
  };

  useEffect(() => {
    const savedPreview = localStorage.getItem(STORAGE_KEY_PREVIEW);
    if (savedPreview) {
      const html = markdownConverter.makeHtml(savedPreview);
      setFreeContent(html);
    }
    const savedPaid = localStorage.getItem(STORAGE_KEY_PAID);
    if (savedPaid) {
      const html = markdownConverter.makeHtml(savedPaid);
      setPaidContent(html);
    }
    const savedTitle = localStorage.getItem(STORAGE_KEY_TITLE);
    if (savedTitle) {
      setTitle(savedTitle);
    }
  }, []);

  return (
    <Flex
      direction="column"
      overflow="auto"
      width="100%"
      minHeight="100vh"
      alignItems="stretch"
      textAlign="left"
      padding="20px"
      gap="20px"
    >
      {activeEditor && (
        <Box style={styles.menuContainer}>
          <FloatingMenu editor={activeEditor} />
        </Box>
      )}
      <Header />
      <Text
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100px"
        fontWeight="bold"
        fontSize="1.5em"
      >
        WRITE GOOD CONTENT
      </Text>
      <Box
        backgroundColor="white"
        height="50px"
        boxShadow="5px 5px 0px 0px black"
      >
        <Input
          height="100%"
          border="none"
          borderRadius="0px"
          placeholder="Article Title"
          fontSize="2.2em"
          value={title}
          fontWeight="bold"
          onChange={handleTitleChange}
        ></Input>
      </Box>
      <Spacer />
      <Box>
        <Text variant="title">Free Preview</Text>
        <Text>
          A description, subtitle, paragraph... whatever works to make the
          reader buy the rest.
        </Text>
      </Box>
      <Box>
        <TiptapEditor
          onUpdate={handlePreviewChange}
          onFocus={handleEditorFocus} // Capture editor focus
          content={freeContent}
        />
      </Box>
      <Spacer />
      <Box>
        <Text variant="title">Paid Content</Text>
        <Text>
          This will be shown to the reader only after purchasing the article.
        </Text>
      </Box>
      <Box>
        <TiptapEditor
          onUpdate={handlePaidChange}
          onFocus={handleEditorFocus} // Capture editor focus
          content={paidContent}
        />
      </Box>
      <SimpleGrid minChildWidth="300px" gap="20px">
        <Box
          backgroundColor="bune.lightGrey"
          border="1px dashed black"
          padding="20px"
          boxShadow="5px 5px 0px 0px black"
          sx={{
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translate(-2px, -2px)",
            },
          }}
        >
          <Heading textAlign="left" variant="title" fontSize="1.5em">
            Revenue Configuration
          </Heading>
          <VStack alignItems="left" width="250px" minWidth="250px">
            <ArticlePriceInput
              defaultValue={DEFAULT_PRICE.toString()}
              onChange={handlePriceChange}
            />
            <ConfigurationInput
              labels={["5%", "10%", "15%"]}
              defaultValue={(DEFAULT_DISTRIBUTOR_REWARD * 100).toString()}
              title="Distributor Reward"
              onChange={handleDistributorRewardChange}
            />
            <ConfigurationInput
              labels={["1%", "2%", "5%"]}
              defaultValue={(DEFAULT_NETWORK_TIP * 100).toString()}
              title="Network Tip"
              onChange={handleNetworkTipChange}
            />
          </VStack>
        </Box>
        <Box
          backgroundColor="bune.lightGrey"
          border="1px dashed black"
          padding="20px"
          boxShadow="5px 5px 0px 0px black"
          sx={{
            transition: "transform 0.2s",
            "&:hover": {
              transform: "translate(-2px, -2px)",
            },
          }}
        >
          <VStack width="100%" alignItems="left" height="100%">
            <Heading textAlign="left" variant="title" fontSize="1.5em">
              Revenue Split
            </Heading>
            <Box
              padding="10px"
              marginTop="20px"
              textAlign="left"
              backgroundColor="white"
              borderBottom="2px solid black"
            >
              <Flex direction="row">
                <Text fontFamily="monospace" alignSelf="flex-start">
                  Your Share
                </Text>
                <Spacer />
                <Text fontFamily="monospace" alignSelf="flex-end">
                  {(
                    price -
                    (price * distributorReward + price * networkTip)
                  ).toFixed(8)}{" "}
                  ETH
                </Text>
              </Flex>
              <Flex direction="row">
                <Text fontFamily="monospace" alignSelf="flex-start">
                  Distributor Reward
                </Text>
                <Spacer />
                <Text fontFamily="monospace" alignSelf="flex-end">
                  {(price * distributorReward).toFixed(8)} ETH
                </Text>
              </Flex>
              <Flex direction="row">
                <Text fontFamily="monospace" alignSelf="flex-start">
                  Network Tip
                </Text>
                <Spacer />
                <Text fontFamily="monospace" alignSelf="flex-end">
                  {(price * networkTip).toFixed(8)} ETH
                </Text>
              </Flex>
            </Box>
            <Flex direction="row" padding="10px">
              <Text
                fontWeight="bold"
                fontFamily="monospace"
                alignSelf="flex-start"
              >
                Total
              </Text>
              <Spacer />
              <Text fontFamily="monospace" alignSelf="flex-end">
                {price}
              </Text>
            </Flex>
            <Spacer />
            <SubmissionHandler
              data={{
                title,
                paidContent,
                freeContent,
                distributorReward,
                networkTip,
                price,
              }}
            />
          </VStack>
        </Box>
      </SimpleGrid>
    </Flex>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  pageContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    minHeight: "100vh",
    position: "relative",
  },
  menuContainer: {
    position: "fixed", // Makes the menu fixed
    top: "50%" /* Move down 50% from the top */,
    transform: "translateY(-50%)",
    left: "20px", // Positions it to the left of the content
    zIndex: 1000,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column", // Align buttons vertically
    gap: "10px",
    width: "max-content", // Only as wide as needed for buttons
  },
  menuContainerMobile: {
    position: "fixed", // Makes the menu fixed
    top: "40px" /* Move down 50% from the top */,
    left: "20px", // Positions it to the left of the content
    zIndex: 1000,
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    padding: "10px",
    borderRadius: "8px",
    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column", // Align buttons vertically
    gap: "10px",
    width: "max-content", // Only as wide as needed for buttons
  },
  mainContent: {
    flexGrow: 1,
    marginLeft: "200px", // Adds space for the menu
    padding: "20px",
  },
};

export default Write;
