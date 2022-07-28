import { Box, Heading, Input, Stack } from "@chakra-ui/react";

type Props = {
  onInputDiscordToken: (inputToken: string) => void;
  onInputDiscordServerId: (inputServerId: string) => void;
};

const DiscordInput = (props: Props) => {
  return (
    <Box w="lg" px={4}>
      <Heading size="md" mt={6} mb={2}>
        DiscordのBotのトークンを入力してください。
      </Heading>
      <Stack mt={8} direction={"column"} spacing={4}>
        <Input
          placeholder="xxxx......"
          type={"text"}
          onChange={(e) => props.onInputDiscordToken(e.target.value)}
        />
      </Stack>
      <Heading size="md" mt={6} mb={2}>
        移行先のDiscordのサーバーIDを入力してください。
      </Heading>
      <Stack mt={8} direction={"column"} spacing={4}>
        <Input
          placeholder="0000......"
          type={"text"}
          onChange={(e) => props.onInputDiscordServerId(e.target.value)}
        />
      </Stack>
    </Box>
  );
};

export default DiscordInput;
