import { WebClient } from "@slack/web-api";
import type { NextApiRequest, NextApiResponse } from "next";
import { SlackChannelType } from "../channels";

export type SlackMessage = {
  message: string;
};

export type SlackMessagesRequest = Omit<NextApiRequest, "body"> & {
  body: {
    slackChannel: SlackChannelType;
    slackToken: string;
  };
};

const handler = async (
  req: SlackMessagesRequest,
  res: NextApiResponse<SlackMessage[]>
) => {
  const { body } = req;

  // TODO newするのは一回のみにしたい
  const client = new WebClient(body.slackToken);

  const members = await client.users.list();

  const messages = await client.conversations.history({
    channel: body.slackChannel.id,
  });

  return res.status(200).json(
    messages
      .messages!.filter(
        (message) =>
          message.type === "message" &&
          message.subtype !== "channel_join" &&
          !!message.text
      )
      .slice()
      .reverse()
      .map((message) => {
        const member = members.members?.find(
          (member) => member.id === message.user
        );
        const text = message.text?.startsWith("<http")
          ? message.text?.split("|")[0].slice(1)
          : message.text;
        const postDateTime = new Date(
          parseInt(message.ts!) * 1000
        ).toLocaleString();

        return `${member?.profile?.display_name_normalized}: ${text}(${postDateTime})`;
      })
      .map((message) => ({ message: message! }))
  );
};

export default handler;
