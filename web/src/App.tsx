import { Button, Flex, Heading, Spacer, VStack } from "@chakra-ui/react";
import ConnectButton from "./ConnectButton";
import Landing from "./Landing";
import { Link, useParams } from "react-router-dom";
import Article from "./Article";

type ArticleParams = {
  tokenID: string;
};

function App() {
  const { tokenID } = useParams<ArticleParams>();

  return (
    <VStack height="100vh">
      <Flex flexDir="row" width="100%" padding="10px">
        <Button variant="primary">ABOUT</Button>
        <Spacer />
        <ConnectButton />
      </Flex>
      <Heading as="h1" size="4xl">
        <Link to="/">Web 3bune</Link>
      </Heading>
      <Spacer />
      {tokenID !== undefined && <Article tokenID={BigInt(tokenID)} />}
      {tokenID === undefined && <Landing />}
    </VStack>
  );
}

export default App;
