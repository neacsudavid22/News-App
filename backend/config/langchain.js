import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";

config();
const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0,
  googleApiKey: process.env.GOOGLE_API_KEY,
});

export default model;