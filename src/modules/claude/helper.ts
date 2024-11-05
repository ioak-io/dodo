const axios = require("axios");

const CLAUDE_API_BASE_URL = "https://api.anthropic.com"; // Updated URL for Claude API
const claudeDefaultApiKey =
  process.env.CLAUDE_API_KEY ||
  "API_KEY";

export const processClaude = async (
  uri: string,
  data: any,
  authorizationHeader: any,
  res: any
) => {
  let authorization = `${claudeDefaultApiKey}`;

  const authString = authorizationHeader || "";
  const authParts = authString.split(" ");
  if (authParts.length === 2) {
    authorization = `${authParts[1]}`;
  }

  const _headers = {
    "Content-Type": "application/json",
    "x-api-key": authorization,
    "anthropic-version": "2023-06-01"
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

      const claudeResponse = await axios.post(
        `${CLAUDE_API_BASE_URL}/${uri}`,
        data,
        {
          headers: _headers,
          responseType: "stream", // Use stream for long-running requests
        }
      );

      claudeResponse.data.on("data", (chunk: any) => {
        const lines = chunk.toString().split("\n");
        for (let line of lines) {
          if (line.trim().startsWith("data:")) {
            const message = line.replace(/^data:\s*/, "");
            sendMessage(message);
          }
        }
      });

      claudeResponse.data.on("end", () => {
        res.end();
      });

      claudeResponse.data.on("error", (err: any) => {
        console.error("Streaming error:", err);
        res.write("data: Error occurred during streaming\n\n");
        res.end();
      });
    } else {
      const claudeResponse = await axios.post(
        `${CLAUDE_API_BASE_URL}/${uri}`,
        data,
        {
          headers: _headers,
        }
      );

      res.json({ code: claudeResponse.status, data: claudeResponse.data });
    }
  } catch (error: any) {
    console.log("**Claude service error");
    console.log(error);
    if (error.response) {
      res.json({ code: error.response.status, data: error.response.data });
    } else {
      res.json({ code: 500, data: { error: "Internal Server Error" } });
    }
  }
};
