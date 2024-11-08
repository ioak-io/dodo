const axios = require("axios");
const { getGlobalCollection } = require("../../lib/dbutils");

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const geminiDefaultApiKey =
  process.env.GEMINI_API_KEY ||
  "GEMINI KEY";

export const processGemini = async (
  uri: string,
  data: any,
  authorizationHeader: any,
  res: any
) => {
  let authorization = `${geminiDefaultApiKey}`;
  const authString = authorizationHeader || "";
  const authParts = authString.split(" ");
  if (authParts.length === 2) {
    authorization = `${authParts[1]}`;
  }
  console.log('auth is '+authorization);
  const params ={
    key:authorization,
  }
  const _headers = {
    "Content-Type": "application/json",
  };

  try {
      const gptResponse = await axios.post(
        `${GEMINI_API_BASE_URL}/${uri}`,
        data,{
          _headers,params
        }
      );
      res.json({ code: gptResponse.status, data: gptResponse.data });

  } catch (error: any) {
    console.log("**Gemini service error");
    console.log(error);
    if (error.response) {
      res.json({ code: error.response.status, data: error.response.data });
    } else {
      res.json({ code: 500, data: { error: "Internal Server Error" } });
    }
  }
};
