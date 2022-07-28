import axios from "axios";
import { ChannelType, Client, GatewayIntentBits } from "discord.js";
import type { NextApiRequest, NextApiResponse } from "next";
import { SlackChannelType } from "../../slack/channels";
import { SlackMessage } from "../../slack/messages";

export type DiscordMessagesTransferRequest = Omit<NextApiRequest, "body"> & {
  body: {
    discordToken: string;
    discordServerId: string;
    slackChannel: SlackChannelType;
    slackMessages: SlackMessage[];
  };
};

const sleep = (second: number) =>
  new Promise((resolve) => setTimeout(resolve, second * 1000));

const handler = async (
  req: DiscordMessagesTransferRequest,
  res: NextApiResponse
) => {
  const { body } = req;

  // TODO newするのは一回のみにしたい
  const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages],
  });

  client.once("ready", () => {
    console.log("Ready!");
  });

  await client.login(body.discordToken);

  const createdDiscordChannel = await client.guilds?.cache
    .get(req.body.discordServerId)
    ?.channels.create({
      name: req.body.slackChannel.name,
      type: ChannelType.GuildText,
    });

  body.slackMessages
    .map((message) => message.message)
    .forEach(async (message) => {
      await createdDiscordChannel?.send(message);
      await sleep(0.1);
    });

  return res.status(200).json({});
};

export default handler;
