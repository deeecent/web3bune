import { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import {
  Box,
  Flex,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { GlitchButton, Header, Windows98ButtonGroup } from "./CustomComponents";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./markdown.css";
import ChaoticImageDisplay from "./Ads";
import { useParams } from "react-router-dom";

const STORAGE_KEY_TITLE = "TMP_TITLE";
const STORAGE_KEY_PREVIEW = "TMP_PREVIEW";
const STORAGE_KEY_PAID = "TMP_PAID";
const FONT = `"Courier New", "monospace"`;

function MintSection({
  author,
  price,
  distributorReward,
  networkTip,
  gasFee,
  onClickMint,
  onClickNo,
}: {
  author: string;
  price: string;
  distributorReward: string;
  networkTip: string;
  gasFee: string;
  onClickMint: () => any;
  onClickNo: () => any;
}) {
  return (
    <Box
      backgroundColor="bune.lightGrey"
      border="1px dashed black"
      padding="20px"
      sx={{
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translate(-2px, -2px)",
        },
      }}
    >
      <VStack width="100%" alignItems="left" height="100%">
        <SimpleGrid columns={2} gap={2}>
          <VStack border="1px solid black" alignItems="left" padding="20px">
            <Text fontWeight="bold" fontSize="20px" textAlign="center">
              Mint to read the rest. Support TimDaub directly.
            </Text>
            <GlitchButton
              isLoading={false}
              onClick={onClickMint}
              label={`Mint - ${price} ETH`}
            />
            <HStack textAlign="center" justifyContent="center" gap="20px">
              <VStack alignItems="center">
                <Text>$0.178</Text>
                <Text>↓</Text>
                <Text>@timdaub</Text>
              </VStack>
              <VStack>
                <Text>$0.02</Text>
                <Text>↓</Text>
                <Text>curator</Text>
              </VStack>
              <VStack>
                <Text>$0.001</Text>
                <Text>↓</Text>
                <Text>network</Text>
              </VStack>
            </HStack>
          </VStack>
          <VStack border="1px solid black" alignItems="left" padding="20px">
            <Text fontWeight="bold" fontSize="20px" textAlign="center">
              Mh, I am not convinced. Support the AD industry.
            </Text>
            <GlitchButton
              isLoading={false}
              onClick={onClickNo}
              label={`I am not paying`}
            />
            <HStack textAlign="center" justifyContent="center" gap="20px">
              <VStack>
                <Text>nothing</Text>
                <Text>↓</Text>
                <Text>@timdaub</Text>
              </VStack>
              <VStack>
                <Text>nothing</Text>
                <Text>↓</Text>
                <Text>curator</Text>
              </VStack>
              <VStack alignItems="center">
                <Text>your life</Text>
                <Text>↓</Text>
                <Text>Google</Text>
              </VStack>
            </HStack>
          </VStack>
        </SimpleGrid>
        <Text fontWeight="bold" textAlign="center">
          Once you buy the article, you will own its NFT.
          <br />
          You can transfer it, as you would do with a news paper, magazine or
          pirated DVD.
        </Text>
      </VStack>
    </Box>
  );
}

function Read() {
  const { articleId } = useParams<Record<"articleId", string>>();

  const [preview, setPreview] = useState("");
  const [paid, setPaid] = useState("");
  const [title, setTitle] = useState("");
  const [minted, setMinted] = useState(false);

  const [author, setAuthor] = useState("@timdaub");
  const [date, setDate] = useState(1736873000);

  const [price, setPrice] = useState("0.001");
  const [reward, setReward] = useState("0.0002");
  const [tip, setTip] = useState("0.0001");
  const [gas, setGas] = useState("0.0000001");

  const [expectChaos, setExpectChaos] = useState(false);

  useEffect(() => {
    const savedPreview = localStorage.getItem(STORAGE_KEY_PREVIEW);
    if (savedPreview) {
      console.log(preview);
      setPreview(savedPreview);
    }
    const savedPaid = localStorage.getItem(STORAGE_KEY_PAID);
    console.log(savedPaid);
    if (savedPaid) {
      setPaid(savedPaid);
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
      <Header />
      <Text
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100px"
        fontWeight="bold"
        fontSize="1.5em"
      >
        READ GOOD CONTENT
      </Text>
      <VStack
        backgroundColor="white"
        padding="20px"
        textAlign="left"
        boxShadow="10px 10px 0px 0px black"
        alignItems="left"
      >
        <Heading size="3xl">{title}</Heading>
        <Text variant="title" marginBottom="50px">
          {author} -{" "}
          {new Date(date * 1000).toLocaleDateString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <div className="markdown">
          <Markdown
            urlTransform={(value: string) => value}
            rehypePlugins={[rehypeRaw]}
          >
            {preview}
          </Markdown>
        </div>
        {minted && (
          <div className="markdown">
            <Markdown
              urlTransform={(value: string) => value}
              rehypePlugins={[rehypeRaw]}
            >
              {paid}
            </Markdown>
          </div>
        )}
        <ChaoticImageDisplay activate={expectChaos} />
        {!minted && (
          <MintSection
            onClickMint={() => setMinted(true)}
            onClickNo={() => {
              setMinted(true);
              setExpectChaos(true);
            }}
            price={price}
            distributorReward={reward}
            networkTip={tip}
            gasFee={gas}
            author={author}
          />
        )}
      </VStack>
    </Flex>
  );
}

export default Read;
