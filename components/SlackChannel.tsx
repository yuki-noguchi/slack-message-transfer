import {
  Button,
  LinkBox,
  LinkOverlay,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { SlackChannelType } from "../pages/api/slack/channels";
import { SlackMessage } from "../pages/api/slack/messages";

type Props = {
  channel: SlackChannelType;
  discordToken: string;
  discordServerId: string;
  slackToken: string;
  onProcessing: (processing: boolean) => void;
};

const SlackChannel = ({
  channel,
  discordToken,
  discordServerId,
  slackToken,
  onProcessing,
}: Props) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [fetching, setFetching] = useState(false);
  const [step, setStep] = useState<"init" | "done">("init");

  const handleSubmit = async () => {
    setFetching(true);
    const slackMessages = await axios.post<SlackMessage[]>(
      "/api/slack/messages",
      {
        slackChannel: channel,
        slackToken: slackToken,
      }
    );

    await axios.post("/api/discord/messages/transfer", {
      discordToken,
      discordServerId,
      slackChannel: channel,
      slackMessages: slackMessages.data,
    });
    setFetching(false);
    setStep("done");
  };

  useEffect(() => {
    onProcessing(fetching);
  }, [fetching]);

  useEffect(() => {
    setStep("init");
  }, [isOpen]);

  return (
    <>
      <LinkBox borderWidth="1px" borderRadius="lg" padding={"2"}>
        <LinkOverlay href={"#"} onClick={onOpen}>
          <Text>{channel.name}</Text>
        </LinkOverlay>
      </LinkBox>
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Slackのメッセージを移行する</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {step === "init" && (
              <>
                <List spacing={2}>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      Slackのチャンネル:{" "}
                    </Text>
                    {channel.name}
                  </ListItem>
                  <ListItem>から</ListItem>
                  <ListItem>
                    <Text as={"span"} fontWeight={"bold"}>
                      DiscordサーバーID:{" "}
                    </Text>
                    {discordServerId}
                  </ListItem>
                  <ListItem>
                    に新規チャンネルを作り、メッセージを移行します。
                  </ListItem>
                </List>
                <ModalFooter>
                  <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
                    移行する
                  </Button>
                  <Button onClick={onClose}>キャンセル</Button>
                </ModalFooter>
              </>
            )}
            {step === "done" && (
              <>
                <Text as={"span"} fontWeight={"bold"}>
                  完了しました。
                  <ModalFooter>
                    <Button onClick={onClose}>閉じる</Button>
                  </ModalFooter>
                </Text>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
export default SlackChannel;
