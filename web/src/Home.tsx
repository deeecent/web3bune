import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  keyframes,
  SimpleGrid,
  Spacer,
  styled,
  Text,
  VStack,
} from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Star,
  User,
  User2,
  LinkIcon,
  UserIcon,
  CoinsIcon,
  User2Icon,
  PencilIcon,
  ShareIcon,
} from "lucide-react";
import { ComponentType } from "react";
import { GlitchButton, Header } from "./CustomComponents";

function Title() {
  return (
    <Box
      width="100%"
      height="320px"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      <Heading as="h1" size="3xl">
        WRITE, GET PAID.
      </Heading>
      <Text variant="title" fontSize="1.3em">
        No Ads. No subscription. No Login.
      </Text>
    </Box>
  );
}

function Menu() {
  return (
    <Box
      marginTop="10px"
      width="100%"
      borderTop="1px solid black"
      borderBottom="1px solid black"
      height="60px"
    >
      <HStack height="100%" width="100%">
        <Spacer />
        <Text margin="10px" variant="title">
          PUBLISH
        </Text>
        <Text margin="10px" variant="title">
          DISTRIBUTE
        </Text>
        <Text margin="10px" variant="title">
          ABOUT
        </Text>
        <Spacer />
      </HStack>
    </Box>
  );
}

type LucidIconProps = {
  size?: string | number;
  color?: string;
  [key: string]: any; // Additional props, if needed
};

type CustomIconProps = {
  IconComponent: ComponentType<LucidIconProps>;
};

function CustomIcon({ IconComponent }: CustomIconProps) {
  return (
    <Box
      width="40px"
      height="40px"
      borderRadius="50%"
      justifyItems="center"
      backgroundColor="white"
    >
      <IconComponent height="100%" color="bune.darkGrey" />
    </Box>
  );
}

function HighlightBox({
  title,
  content,
  button,
}: {
  title: string;
  content: string[];
  button: string;
}) {
  return (
    <VStack
      height="100%"
      padding="20px"
      backgroundColor="white"
      boxShadow="10px 10px 0px 0px black"
      alignItems="flex-start"
      sx={{
        transition: "transform 0.2s",
        "&:hover": {
          transform: "translate(-2px, -2px)",
        },
      }}
    >
      <Text width="100%" variant="title" marginBottom="10px" fontSize="1.5em">
        {title}
      </Text>
      <Text width="100%" whiteSpace="pre-line">
        {content.map((line, i) => (
          <>
            {line}
            {i < content.length - 1 && <br />}
          </>
        ))}
      </Text>
      <Spacer />

      <Link to="/write">
        <GlitchButton label={button} />
      </Link>
    </VStack>
  );
}

function CallToActions() {
  return (
    <SimpleGrid textAlign="left" minChildWidth="300px" gap="50px" width="100%">
      <HighlightBox
        title="Write  → Get Paid"
        content={[
          "Write, set a price and sharing reward.",
          "No ads. No subs. No clickbaits.",
          "Write good stuff and people will buy it.",
        ]}
        button="Start writing"
      />
      <HighlightBox
        title="Promote → Get Paid"
        content={[
          "Buy an article, share it and earn.",
          "Publisher, aggregator, doesn't matter.",
          "You are useful, you get paid.",
        ]}
        button="Browse articles"
      />
    </SimpleGrid>
  );
}

function Card({
  title,
  subtitle,
  preview,
  author,
  price,
  fee,
}: {
  height: string;
  title: string;
  subtitle: string;
  preview: string;
  author: string;
  price: number;
  fee: number;
}) {
  return (
    <VStack
      backgroundColor="white"
      padding="20px"
      height="100%"
      outline="double #bbbbbb"
      textAlign="left"
    >
      <Heading fontSize="2em">{title}</Heading>
      <Text width="100%" marginTop="10px" fontStyle="italic" fontSize="1.2em">
        {subtitle}
      </Text>
      <Text marginTop="10px">{preview}</Text>
      <Spacer />
      <HStack
        width="100%"
        marginTop="10px"
        paddingTop="10px"
        borderTop="1px solid black"
      >
        <User />
        <Text>{author}</Text>
        <Spacer />
        <Text>{price} ETH</Text>
        <Spacer />
        <Button
          fontSize="0.8em"
          fontFamily="SourceSerifProBold"
          background="rgb(196,127,35)"
          color="white"
        >
          Share & Earn {fee * 100}%
        </Button>
      </HStack>
    </VStack>
  );
}

function Samples() {
  return (
    <Grid
      width="100%"
      templateRows="repeat(2, 1fr)"
      templateColumns="repeat(4, 1fr)"
      gap={4}
      marginTop="20px"
    >
      <GridItem rowSpan={2} colSpan={2}>
        <Card
          height="100px"
          title="The Future of Decentralized Publishing"
          subtitle="A Chronicle of the Digital Age"
          preview="As we enter a new era of digital content creation, blockchain technology offers unprecedented opportunities for writers and readers alike. As we enter a new era of digital content creation, blockchain technology offers unprecedented opportunities for writers and readers alike. As we enter a new era of digital content creation, blockchain technology offers unprecedented opportunities for writers and readers alike..."
          author="Elena Thompson"
          price={0.01}
          fee={0.2}
        />
      </GridItem>
      <GridItem colSpan={2}>
        <Card
          height="100px"
          title="The Future of Decentralized Publishing"
          subtitle="A Chronicle of the Digital Age"
          preview="As we enter a new era of digital content creation, blockchain technology offers unprecedented opportunities for writers and readers alike..."
          author="Elena Thompson"
          price={0.01}
          fee={0.2}
        />
      </GridItem>
      <GridItem colSpan={2}>
        <Card
          height="100px"
          title="The Future of Decentralized Publishing"
          subtitle="A Chronicle of the Digital Age"
          preview="As we enter a new era of digital content creation, blockchain technology offers unprecedented opportunities for writers and readers alike..."
          author="Elena Thompson"
          price={0.01}
          fee={0.2}
        />
      </GridItem>
    </Grid>
  );
}

function Home() {
  return (
    <VStack minHeight="100vh" padding="20px" width="100%">
      <Header />
      <Title />
      <CallToActions />
      <Spacer />
      <HStack>
        <Text>© 2025 deeecent</Text>
        <Text>-</Text>
        <Text>smart contract</Text>
        <Text>-</Text>
        <Text>about</Text>
      </HStack>
    </VStack>
  );
}

export default Home;
