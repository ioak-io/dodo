const axios = require("axios");
import { chatgptCollection, chatgptSchema } from "./model";
const { getGlobalCollection } = require("../../lib/dbutils");

const CHATGPT_API_BASE_URL = "https://api.openai.com/";
const chatgptDefaultApiKey =
  process.env.CHATGPT_API_KEY ||
  "CHAT GPT KEY";

export const processChatGpt = async (
  uri: string,
  data: any,
  authorizationHeader: any,
  res: any
) => {
  let authorization = `Bearer ${chatgptDefaultApiKey}`;

  const authString = authorizationHeader || "";
  const authParts = authString.split(" ");
  if (authParts.length === 2) {
    authorization = `Bearer ${authParts[1]}`;
  }
  const _headers = {
    "Content-Type": "application/json",
    authorization,
  };

  try {
    if (data.stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      res.flushHeaders();

      const sendMessage = (message: any) => {
        res.write(`data: ${message}\n\n`);
      };

      const gptResponse = await axios.post(
        `${CHATGPT_API_BASE_URL}/${uri}`,
        data,
        {
          headers: _headers,
          responseType: "stream",
        }
      );

      gptResponse.data.on("data", (chunk: any) => {
        const lines = chunk.toString().split("\n");
        for (let line of lines) {
          if (line.trim().startsWith("data:")) {
            const message = line.replace(/^data:\s*/, "");
            sendMessage(message);
          }
        }
      });

      gptResponse.data.on("end", () => {
        res.end();
      });

      gptResponse.data.on("error", (err: any) => {
        console.error("Streaming error:", err);
        res.write("data: Error occurred during streaming\n\n");
        res.end();
      });
    } else {
      const gptResponse = await axios.post(
        `${CHATGPT_API_BASE_URL}/${uri}`,
        data,
        {
          headers: _headers,
        }
      );

      res.json({ code: gptResponse.status, data: gptResponse.data });
    }
  } catch (error: any) {
    console.log("**GPT service error");
    console.log(error);
    if (error.response) {
      res.json({ code: error.response.status, data: error.response.data });
    } else {
      res.json({ code: 500, data: { error: "Internal Server Error" } });
    }
  }
};
