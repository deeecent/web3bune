import { Heading, HStack, Spacer, Text, VStack } from "@chakra-ui/react";
import { Header } from "./CustomComponents";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./markdown.css";

function Manifesto() {
  const markdown = `_Time and time again_, back in 2012, I was thinking about how to make the world a better place.

I figured that making buttons to book hotels faster was probably not going to cut it. I had a hunch that one of the pillars of how our society develops is information. If I wanted to have an impact, that was the place to start.

I joined a **huge media conglomerate**, aware of all the controversies surrounding it, to get a glimpse of why things are the way they are and to figure out if something could be changed from the inside. Fight the enemy within.

Before long, I was part of the team that brought **Europe’s biggest news aggregator** and recommender to life. A fun ride—until money became a problem. That was the point when the truth started to unravel. It wasn’t about content. It was about ads.

**The news industry wasn’t making money by selling newspapers**. Although it had always partly relied on ads, this had now become the one and only source of revenue. Years spent figuring out alternative models were futile. Subscriptions only worked for the biggest few. I saw the tension over stolen ad impressions between our aggregator and content platforms: we needed more users in our app, and they needed them too. It didn’t matter what was shown to them, as long as there was a cookie.

I witnessed **the rise of clickbait headlines, garbage content, and pet images** in a world that was once populated by people sharing information and wisdom. Now, it’s infested with bots ranking up junk posts to steal user clicks and attention. No wonder my mother gets her news from WhatsApp, and many content creators fight their way up to the narrow peak of the pyramid, just making what the algorithm demands.

I always thought the solution to the problem was simple: pay for content. And I don’t mean paying €100 for a year of unlimited content. Pay 10 cents or 1 EUR for a good piece of content. I tried to develop this "revolutionary" concept at my old employer, but the number of middlemen wanting a cut of the pie made it nearly impossible to conceive it in its most pristine and effective form.

This is why today I’m launching **web3bune**. My aim is to test whether something everyone has always feared can actually work: **paying for information**. Not much—just enough. And: incentivizing everyone in the system to ensure people actually read the content rather than just glance at the headline.

Web3bune is not only a micro-payment platform for textual content but also a **system of incentives to encourage curators** (e.g., publishers, aggregators, bloggers...) to promote good content and send users to actually read it. This is mainly a protocol, where the only source of income for its creators will be an optional network fee. We believe the only way to test this concept is to eliminate the financial burden for the different actors and ensure money flows to those who truly deserve it.

We won’t get rich, but hopefully, we will spark a shift towards a healthier relationship between readers, writers, and curators. For now, we focus on web3 because web3-native people already have the setup and mindset to interact with micro-economies. We aim to help writers who enjoy publishing content but don’t necessarily want to make it a daily or weekly obligation (as subscription models demand).

Instead, they can **sell occasional articles** rather than subscriptions—much like a musician would release songs. Readers can hopefully experience the joy of reading an interesting article without needing to commit to a monthly fee. They can also share it with friends, just as people did with newspapers. Distributors will earn a cut of the revenue if they do a good job promoting the right content to their audience.

This is it. **For now**.`;
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
        <Heading size="2xl">
          The News Industry Most Terrible Secret You Won't Believe it Click Here
          To Find Out
        </Heading>
        <Text variant="title" marginBottom="50px">
          Nicola - 1.02.2025
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

export default Manifesto;
