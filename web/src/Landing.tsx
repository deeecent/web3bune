import { HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import Example from "./Example";
import Create from "./Create";

function Landing() {
  return (
    <VStack height="100vh" width="100%">
      <Text fontSize="20px">Get paid for your writings.</Text>
      <Spacer />
      <VStack>
        <Text variant="bold">Examples</Text>
      </VStack>
      <HStack>
        <Example />
        <Example />
        <Example />
      </HStack>
      <Spacer />
      <Create />
    </VStack>
  );
}

export default Landing;
