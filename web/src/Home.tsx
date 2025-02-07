import {
  Box,
  Heading,
  HStack,
  SimpleGrid,
  Spacer,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
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
        <GlitchButton
          isLoading={false}
          onClick={() => undefined}
          label={button}
        />
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

function Home() {
  return (
    <VStack
      width="70%"
      maxWidth="1000px"
      margin="0 auto"
      minHeight="100vh"
      padding="20px"
    >
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
        <Text>-</Text>
        <Link to="/manifesto">manifesto</Link>
      </HStack>
    </VStack>
  );
}

export default Home;
