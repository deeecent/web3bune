import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import { Link } from "react-router-dom";
import { TrendingUp, Star, User } from "lucide-react";

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
      <Text>EST 2025 • "All the Content That's Fit to Mint"</Text>
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
          <Text>LATEST</Text>
          <Text>TECHNOLOGY</Text>
          <Text>ECONOMICS</Text>
          <Text>ANALYSIS</Text>
          <Spacer />
        </HStack>
      </Box>
    </Box>
  );
}

function Card({
  width,
  title,
  subtitle,
  preview,
  author,
  price,
}: {
  width: string;
  height: string;
  title: string;
  subtitle: string;
  preview: string;
  author: string;
  price: number;
}) {
  return (
    <Box
      width={width}
      backgroundColor="white"
      padding="20px"
      outline="double #bbbbbb"
      textAlign="left"
    >
      <Heading fontSize="2em">{title}</Heading>
      <Text marginTop="10px" fontStyle="italic" fontSize="1.2em">
        {subtitle}
      </Text>
      <Text marginTop="10px">{preview}</Text>
      <HStack marginTop="10px" paddingTop="10px" borderTop="1px solid black">
        <User />
        <Text>{author}</Text>
        <Spacer />
        <Text>{price} ETH</Text>
      </HStack>
    </Box>
  );
}

function Home() {
  return (
    <VStack width="90%" margin="0 auto">
      <Header />
      <Title />
      <Menu />
      <HStack marginTop="20px">
        <Card
          width="50%"
          height="100px"
          title="The Future of Decentralized Publishing"
          subtitle="A Chronicle of the Digital Age"
          preview="As we enter a new era of digital content creation, blockchain technology offers unprecedented opportunities for writers and readers alike..."
          author="Elena Thompson"
          price={0.01}
        />
      </HStack>
    </VStack>
  );
}

export default Home;
