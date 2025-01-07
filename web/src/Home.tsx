import {
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
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

function Header() {
  return (
    <HStack width="100%">
      <ConnectButton />
      <Text>Vol. MCMXXI</Text>
      <Spacer />
      <Spacer />
      <TrendingUp />
      <Text marginLeft="20px" marginRight="20px">
        ETH: 3,450
      </Text>
      <Star />
      <Text marginLeft="20px">TRENDING: Web3 Publishing</Text>
    </HStack>
  );
}

function Title() {
  return (
    <Box width="100%" borderBottom="2px solid black" height="120px">
      <Heading as="h1" size="4xl">
        <Link to="/">Web3bune</Link>
      </Heading>
      <Text variant="title">
        EST 2025 • "All the Content That's Fit to Mint"
      </Text>
    </Box>
  );
}

function Menu() {
  return (
    <Box
      marginTop="10px"
      width="100%"
      borderTop="2px solid black"
      borderBottom="2px solid black"
      height="60px"
    >
      <Box
        height="46px"
        width="100%"
        marginTop="5px"
        borderTop="1px solid black"
        borderBottom="1px solid black"
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
      backgroundColor="rgb(251,243,202)"
    >
      <IconComponent height="100%" color="rgb(196,127,35)" />
    </Box>
  );
}

function Intro() {
  return (
    <VStack
      width="100%"
      outline="double #bbbbbb"
      padding="20px"
      backgroundColor="white"
    >
      <Heading marginBottom="10px" fontSize="1.5em">
        How Web3bune Works
      </Heading>
      <HStack>
        <VStack width="33%">
          <CustomIcon IconComponent={UserIcon} />
          <Heading fontSize="1em">1. Writers Publish</Heading>
          <Text maxWidth="200px">
            Authors write articles, with price and sharing fee
          </Text>
        </VStack>
        <Spacer />
        <VStack width="33%">
          <CustomIcon IconComponent={LinkIcon} />
          <Heading fontSize="1em">2. Share & Earn</Heading>
          <Text maxWidth="200px">
            Distributors share the link with their wallet
          </Text>
        </VStack>
        <Spacer />
        <VStack width="33%">
          <CustomIcon IconComponent={CoinsIcon} />
          <Heading fontSize="1em">3. Automatic Split</Heading>
          <Text maxWidth="200px">
            Revenue is automatically split between them
          </Text>
        </VStack>
      </HStack>
    </VStack>
  );
}

function CallToActions() {
  return (
    <SimpleGrid minChildWidth="300px" gap="10px" width="100%">
      <VStack
        height="100%"
        outline="double rgb(247,231,144)"
        padding="20px"
        backgroundColor="white"
      >
        <PencilIcon color="rgb(196,127,35)" />
        <Heading marginBottom="10px" fontSize="1.5em">
          For Writers
        </Heading>
        <Text maxWidth="250px">
          Write, set a price and sharing fee. Get paid and reward those who
          share your work.
        </Text>
        <Button background="rgb(196,127,35)" color="white">
          Write Your 1st Article
        </Button>
      </VStack>
      <VStack
        height="100%"
        outline="double #bbbbbb"
        padding="20px"
        backgroundColor="white"
      >
        <ShareIcon lightingColor="rgb(86,83,79)" />
        <Heading marginBottom="10px" fontSize="1.5em">
          For Promoters
        </Heading>
        <Text maxWidth="200px">
          Buy an article, share it and earn a percentage for each future sale.
        </Text>
        <Button background="rgb(86,83,79)" color="white">
          Browse Articles to Share
        </Button>
      </VStack>
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
        <Button background="rgb(196,127,35)" color="white">
          Share & Earn {fee * 100}%
        </Button>
      </HStack>
    </VStack>
  );
}

function Home() {
  return (
    <>
      <Header />
      <Title />
      <Spacer />
      <CallToActions />
      <Menu />
      <Grid
        width="100%"
        templateRows="repeat(2, 1fr)"
        templateColumns="repeat(3, 1fr)"
        gap={4}
        marginTop="20px"
      >
        <GridItem rowSpan={2} colSpan={1}>
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
    </>
  );
}

export default Home;
