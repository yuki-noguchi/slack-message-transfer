import { WebClient } from "@slack/web-api";
import type { NextApiRequest, NextApiResponse } from "next";

export type SlackChannelsRequest = Omit<NextApiRequest, "body"> & {
  body: { token: string };
};

export type SlackChannelType = {
  id: string;
  name: string;
};

const handler = async (
  req: SlackChannelsRequest,
  res: NextApiResponse<SlackChannelType[]>
) => {
  const { body } = req;

  // TODO newするのは一回のみにしたい
  const client = new WebClient(body.token);
  const result = await client.conversations.list();

  return res.status(200).json(
    result.channels!.map((channel) => ({
      id: channel.id!,
      name: channel.name!,
    }))
  );
};

export default handler;
