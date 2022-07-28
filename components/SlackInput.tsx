import {
  Box,
  Button,
  Container,
  Heading,
  Input,
  Text,
  Stack,
  Spinner,
  Center,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { SlackChannelType } from "../pages/api/slack/channels";

type Props = {
  onChannelFetch: (channels: SlackChannelType[]) => void;
  onInputSlackToken: (token: string) => void;
};

const SlackInput = (props: Props) => {
  const [slackToken, setSlackToken] = useState("");
  const [fetching, setFetching] = useState(false);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      await handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setFetching(true);
    const res = await axios.post<SlackChannelType[]>("/api/slack/channels", {
      token: slackToken,
    });
    setFetching(false);
    props.onChannelFetch(res.data);
  };

  return (
    <Box w="lg" px={4}>
      <Heading size="md" mt={6} mb={2}>
        SlackのOAuth Tokensを入力してください。
      </Heading>
      <Text color={"gray.500"}>
        入力されたOAuth Tokensをもとにチャンネル一覧を取得します。
      </Text>
      <Stack mt={8} direction={"row"} spacing={4}>
        <Input
          placeholder="xoxb-......"
          type={"text"}
          value={slackToken}
          onChange={(e) => {
            setSlackToken(e.target.value);
            props.onInputSlackToken(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        <Button onClick={handleSubmit} isLoading={fetching}>
          取得する
        </Button>
      </Stack>
    </Box>
  );
};

export default SlackInput;
