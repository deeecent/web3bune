import { useEffect, useState } from "react";
// define your extension array
import TurndownService from "turndown";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GlitchButton, Header, Windows98ButtonGroup } from "./CustomComponents";
import Showdown from "showdown";
import { EthToUsdConverter } from "./EthConverter";
import { TiptapEditor, FloatingMenu } from "./Editor";

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
        <EthToUsdConverter ethValue={debouncedValue} />
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

function Write() {
  const [title, setTitle] = useState<string>();
  const [preview, setPreview] = useState("");
  const [paid, setPaid] = useState("");

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
    setPreview(value);
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
    setPaid(value);
    const markdown = turndownService.turndown(value); // Convert HTML to Markdown
    localStorage.setItem(STORAGE_KEY_PAID, markdown);
  };

  useEffect(() => {
    const savedPreview = localStorage.getItem(STORAGE_KEY_PREVIEW);
    if (savedPreview) {
      const html = markdownConverter.makeHtml(savedPreview);
      setPreview(html);
      console.log(html);
    }
    const savedPaid = localStorage.getItem(STORAGE_KEY_PAID);
    if (savedPaid) {
      const html = markdownConverter.makeHtml(savedPaid);
      setPaid(html);
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
          content={preview}
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
          content={paid}
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
                0.01 ETH
              </Text>
            </Flex>
            <Spacer />
            <GlitchButton onClick={() => {}} label="Publish Article" />
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
  mainContent: {
    flexGrow: 1,
    marginLeft: "200px", // Adds space for the menu
    padding: "20px",
  },
};

export default Write;
