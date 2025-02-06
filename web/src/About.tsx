import { Heading, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { Header } from "./CustomComponents";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./markdown.css";

function About() {
  const markdown = `
#### Empowering Writers, Elevating Content, Rewarding Curation
Web3bune is not just another publishing platform—it is an open, decentralized ecosystem designed to empower writers by helping them monetize their content while ensuring readers access high-quality, community-vetted material.  

Unlike traditional publishers or platforms like Medium or Paragraph.xyz, Web3bune does not seek to control, brand, or centralize content. Instead, we offer a permissionless infrastructure where content published via Web3bune can be freely hosted anywhere, without requiring attribution to our name.  

#### Web3bune is to Textual Content what Bandcamp is to Music  

Bandcamp serves as a major inspiration for this model:  

- It provides the infrastructure for musicians to sell directly to fans.  
- Artists retain full ownership and set their own prices.  
- Built-in incentive mechanisms drive promotion and engagement.  
- It is **not** a record label—it is a platform that enables **direct artist-to-fan relationships**.  

Web3bune mirrors this ethos, but for writers:  

- **We provide the tools for writers to sell directly to readers.**  
- **Writers maintain complete ownership and pricing control.**  
- **A built-in incentive system rewards engagement and promotion.**  
- **Web3bune is not a publisher—it is a platform enabling direct writer-to-reader relationships.**  

#### A System That Rewards Quality and Curation  

One of the core innovations of Web3bune is its **incentive system**, designed to encourage **everyone**—publishers, aggregators, and independent promoters—to help surface and distribute quality content.  

The traditional web is plagued by a **zero-sum game** where platforms compete for traffic, stealing visits from one another to maximize ad impressions. This model forces publishers to focus on clickbait and SEO hacks rather than substance.  

Web3bune **flips this paradigm**:  

- Instead of platforms fighting over attention, **curators and promoters are rewarded for amplifying great content**.  
- By sharing and promoting high-quality work, **curators help writers earn—and in turn, earn themselves**.  
- This creates a **win-win ecosystem** where those who drive engagement are recognized and incentivized, rather than being at the mercy of centralized algorithms.  

#### A Fundamental Difference: No Mandatory Fees  

Unlike most Web3 platforms, Web3bune does **not** enforce any network fees—making them entirely optional.  

#### Why?  

Because the journalism industry has long been in decline, trapped in a system where readers "pay" with their **personal data** rather than money. This ingrained behavior is difficult to change.  

For a true transition to a sustainable, reader-supported economy, **we have chosen to remove ourselves from the equation**—eliminating unnecessary frictions that might hinder adoption.  

After all, if every HTTP request had a fee, the internet as we know it would never have thrived.  

We are not yet certain how sustainable this model will be, but we are committed to exploring alternative revenue streams if necessary.  

### The Road Ahead  

Our long-term vision goes beyond just being an **"alternative to Paragraph.xyz."** While today’s platform might resemble existing models, our goal is to continually **decouple content display from the protocol**—giving writers full control over their identity, maximizing their reach, and ultimately increasing their sales.  

More than just a publishing platform, Web3bune is a movement—toward a **freer, fairer, and more open** future for **writers, readers, and curators alike.**  
`;

  return (
    <VStack minHeight="100vh" padding="20px" width="100%">
      <Header />
      <VStack
        marginTop="50px"
        backgroundColor="white"
        padding="20px"
        textAlign="left"
        boxShadow="10px 10px 0px 0px black"
        alignItems="left"
      >
        <Heading size="2xl">Web3bune: The Content Uprising.</Heading>
        <Text variant="title" marginBottom="50px">
          deeecent team - 1.02.2025
        </Text>
        <div className="markdown">
          <Markdown
            urlTransform={(value: string) => value}
            rehypePlugins={[rehypeRaw]}
          >
            {markdown}
          </Markdown>
        </div>
      </VStack>
      <Spacer />
      <HStack marginTop="50px">
        <Text>© 2025 deeecent</Text>
        <Text>-</Text>
        <Text>smart contract</Text>
        <Text>-</Text>
        <Text>about</Text>
      </HStack>
    </VStack>
  );
}

export default About;
