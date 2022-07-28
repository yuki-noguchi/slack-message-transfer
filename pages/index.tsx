import {
  Box,
  Center,
  Container,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { NextPage } from "next";
import { useState } from "react";
import DiscordInput from "../components/DiscordInput";
import SlackChannel from "../components/SlackChannel";
import SlackInput from "../components/SlackInput";
import { SlackChannelType } from "./api/slack/channels";

const Home: NextPage = () => {
  const [slackToken, setSlackToken] = useState("");
  const [slackChannels, setSlackChannels] = useState<SlackChannelType[]>([]);
  const [discordToken, setDiscordToken] = useState("");
  const [discordServerId, setDiscordServerId] = useState("");
  const [processing, setProcessing] = useState(false);

  return (
    <Container centerContent>
      <DiscordInput
        onInputDiscordServerId={setDiscordServerId}
        onInputDiscordToken={setDiscordToken}
      />
      <SlackInput
        onChannelFetch={setSlackChannels}
        onInputSlackToken={setSlackToken}
      />
      <Box w="lg" px={4}>
        <VStack mt={8} spacing={4} align="stretch">
          {slackChannels.length > 0 && (
            <>
              <Text color={"gray.500"}>チャンネル一覧</Text>
              {slackChannels.map((channel) => (
                <SlackChannel
                  key={channel.id}
                  slackToken={slackToken}
                  channel={channel}
                  discordToken={discordToken}
                  discordServerId={discordServerId}
                  onProcessing={setProcessing}
                />
              ))}
            </>
          )}
        </VStack>
      </Box>
      {processing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 1500,
            backgroundColor: "rgba(0, 0, 0, 0.16)",
            backdropFilter: "blur(1px) hue-rotate(90deg)",
            marginTop: 0,
          }}
        >
          <Center h={"100%"}>
            <Spinner zIndex={1600} color="blue.500" size="xl" thickness="4px" />
          </Center>
        </div>
      )}
    </Container>
  );
};

export default Home;
